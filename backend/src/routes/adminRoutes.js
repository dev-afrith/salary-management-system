const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken, isAdmin);

// --- Employee Management ---
router.get('/employees', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, u.email 
            FROM Employees e 
            JOIN Users u ON e.user_id = u.id 
            WHERE e.status = 'Active'
            ORDER BY e.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching employees' });
    }
});

router.get('/employees/archive', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT e.*, u.email 
            FROM Employees e 
            JOIN Users u ON e.user_id = u.id 
            WHERE e.status = 'Inactive'
            ORDER BY e.id DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching archived employees' });
    }
});

router.post('/employees', async (req, res) => {
    const { email, password, first_name, last_name, department, designation, base_salary, joined_date, contact_number, birthdate } = req.body;

    const requiredFields = { email, password, first_name, last_name, base_salary, joined_date, contact_number, birthdate };
    const missing = Object.keys(requiredFields).filter(key => !requiredFields[key]);

    if (missing.length > 0) {
        return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert User
        const passwordHash = await bcrypt.hash(password, 10);
        const [userResult] = await connection.query(
            'INSERT INTO Users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, passwordHash, 'employee']
        );
        const userId = userResult.insertId;

        // 2. Insert Employee
        await connection.query(
            'INSERT INTO Employees (user_id, first_name, last_name, department, designation, base_salary, joined_date, contact_number, birthdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, first_name, last_name, department, designation, base_salary, joined_date, contact_number, birthdate]
        );

        await connection.commit();
        res.status(201).json({ message: 'Employee onboarded successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error onboarding employee' });
    } finally {
        connection.release();
    }
});

router.put('/employees/:id', async (req, res) => {
    const { first_name, last_name, department, designation, base_salary, joined_date, contact_number, birthdate } = req.body;

    const requiredFields = { first_name, last_name, base_salary, joined_date, contact_number, birthdate };
    const missing = Object.keys(requiredFields).filter(key => !requiredFields[key] || String(requiredFields[key]).trim() === '');

    if (missing.length > 0) {
        return res.status(400).json({ message: `Required fields are missing: ${missing.join(', ')}` });
    }

    try {
        await db.query(
            'UPDATE Employees SET first_name = ?, last_name = ?, department = ?, designation = ?, base_salary = ?, joined_date = ?, contact_number = ?, birthdate = ? WHERE id = ?',
            [first_name, last_name, department, designation, base_salary, joined_date, contact_number, birthdate, req.params.id]
        );
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating employee' });
    }
});

router.delete('/employees/:id', async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Soft delete the Employee
        await connection.query("UPDATE Employees SET status = 'Inactive' WHERE id = ?", [req.params.id]);

        // Soft delete the associated User
        const [emp] = await connection.query('SELECT user_id FROM Employees WHERE id = ?', [req.params.id]);
        if (emp.length > 0) {
            await connection.query('UPDATE Users SET is_active = FALSE WHERE id = ?', [emp[0].user_id]);
        }

        await connection.commit();
        res.json({ message: 'Employee archived successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error archiving employee' });
    } finally {
        connection.release();
    }
});

// --- Leave Management ---
router.get('/leaves', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, e.first_name, e.last_name, e.department 
            FROM LeaveRequests l 
            JOIN Employees e ON l.employee_id = e.id 
            ORDER BY l.applied_on DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves' });
    }
});

router.put('/leaves/:id', async (req, res) => {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status update' });
    }
    try {
        await db.query('UPDATE LeaveRequests SET status = ? WHERE id = ?', [status, req.params.id]);

        // Notify Employee
        const [request] = await db.query('SELECT employee_id FROM LeaveRequests WHERE id = ?', [req.params.id]);
        if (request.length > 0) {
            const [emps] = await db.query('SELECT user_id FROM Employees WHERE id = ?', [request[0].employee_id]);
            if (emps.length > 0) {
                await db.query(
                    'INSERT INTO Notifications (user_id, title, message) VALUES (?, ?, ?)',
                    [emps[0].user_id, 'Leave Request Update', `Your leave request has been ${status.toUpperCase()}.`]
                );
            }
        }

        res.json({ message: `Leave request ${status.toLowerCase()} and employee notified` });
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(500).json({ message: 'Error updating leave request' });
    }
});

// --- Payroll Management ---
router.get('/salaries', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, e.first_name, e.last_name 
            FROM Salaries s 
            JOIN Employees e ON s.employee_id = e.id 
            ORDER BY s.id DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching salaries' });
    }
});

router.post('/payroll/preview', async (req, res) => {
    const { month_year, employee_id, bonus = 0.00, deductions = 0.00 } = req.body;
    if (!month_year || !employee_id) return res.json(null);

    try {
        const [emps] = await db.query('SELECT base_salary FROM Employees WHERE id = ?', [employee_id]);
        if (emps.length === 0) return res.json(null);

        const base_amount = parseFloat(emps[0].base_salary);
        const hra = base_amount * 0.40;
        const da = base_amount * 0.10;
        const pf = base_amount * 0.12;

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const [mStr, yStr] = month_year.split(' ');
        const targetMonth = monthNames.indexOf(mStr);
        const targetYear = parseInt(yStr);

        let lop_deduction = 0.00;
        if (targetMonth !== -1 && !isNaN(targetYear)) {
            const [leaves] = await db.query(
                "SELECT start_date, end_date FROM LeaveRequests WHERE employee_id = ? AND status = 'Approved' AND leave_type LIKE '%Unpaid%'",
                [employee_id]
            );

            let lopDays = 0;
            leaves.forEach(leave => {
                let current = new Date(leave.start_date);
                const end = new Date(leave.end_date);
                while (current <= end) {
                    if (current.getMonth() === targetMonth && current.getFullYear() === targetYear) {
                        lopDays++;
                    }
                    current.setDate(current.getDate() + 1);
                }
            });
            lop_deduction = (base_amount / 30) * lopDays;
        }

        const gross = base_amount + hra + da;
        const net_salary = gross - (pf + lop_deduction + parseFloat(deductions)) + parseFloat(bonus);

        res.json({ base_amount, hra, da, pf, lop_deduction, gross, net_salary });
    } catch (error) {
        res.status(500).json({ message: 'Error previewing payroll' });
    }
});

router.post('/payroll/generate', async (req, res) => {
    const { month_year, employee_id, bonus = 0.00, deductions = 0.00 } = req.body;
    if (!month_year || !employee_id) {
        return res.status(400).json({ message: 'month_year and employee_id required' });
    }

    try {
        // Check if salary already processed for this month
        const [existing] = await db.query('SELECT id FROM Salaries WHERE employee_id = ? AND month_year = ?', [employee_id, month_year]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Salary already processed for this employee for this month.' });
        }

        // Get employee base
        const [emps] = await db.query('SELECT base_salary, user_id FROM Employees WHERE id = ?', [employee_id]);
        if (emps.length === 0) return res.status(404).json({ message: 'Employee not found' });

        const base_amount = parseFloat(emps[0].base_salary);
        const user_id = emps[0].user_id;

        // 1. Calculate HRA, DA, PF
        const hra = base_amount * 0.40;
        const da = base_amount * 0.10;
        const pf = base_amount * 0.12;

        // 2. Calculate LOP (Loss of Pay)
        // Parse month_year (e.g., "March 2026")
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const [mStr, yStr] = month_year.split(' ');
        const targetMonth = monthNames.indexOf(mStr);
        const targetYear = parseInt(yStr);

        let lop_deduction = 0.00;
        if (targetMonth !== -1 && !isNaN(targetYear)) {
            const [leaves] = await db.query(
                "SELECT start_date, end_date FROM LeaveRequests WHERE employee_id = ? AND status = 'Approved' AND leave_type LIKE '%Unpaid%'",
                [employee_id]
            );

            let lopDays = 0;
            leaves.forEach(leave => {
                let current = new Date(leave.start_date);
                const end = new Date(leave.end_date);
                while (current <= end) {
                    if (current.getMonth() === targetMonth && current.getFullYear() === targetYear) {
                        lopDays++;
                    }
                    current.setDate(current.getDate() + 1);
                }
            });

            lop_deduction = (base_amount / 30) * lopDays;
        }

        // 3. Final Net Salary
        const gross = base_amount + hra + da;
        const net_salary = gross - (pf + lop_deduction + parseFloat(deductions)) + parseFloat(bonus);

        // 4. Insert into database
        await db.query(
            'INSERT INTO Salaries (employee_id, month_year, base_amount, bonus, deductions, net_salary, hra, da, pf, lop_deduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employee_id, month_year, base_amount, bonus, deductions, net_salary, hra, da, pf, lop_deduction]
        );

        // 5. Insert Notification
        const notifTitle = "Salary Processed";
        const notifMessage = `Your salary for ${month_year} has been successfully processed and credited.`;
        await db.query(
            'INSERT INTO Notifications (user_id, title, message) VALUES (?, ?, ?)',
            [user_id, notifTitle, notifMessage]
        );

        // Also notify Admin
        const [empInfo] = await db.query('SELECT first_name, last_name FROM Employees WHERE id = ?', [employee_id]);
        const empName = empInfo.length > 0 ? `${empInfo[0].first_name} ${empInfo[0].last_name}`.toUpperCase() : 'Employee';
        const [admins] = await db.query("SELECT id FROM Users WHERE role = 'admin'");
        if (admins.length > 0) {
            const adminNotifs = admins.map(a => [a.id, 'Payroll Generated', `Payroll for ${empName} (${month_year}) has been generated.`]);
            await db.query('INSERT INTO Notifications (user_id, title, message) VALUES ?', [adminNotifs]);
        }

        res.status(201).json({ message: 'Payroll generated and notifications sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating payroll' });
    }
});

// --- Announcements ---
router.get('/announcements', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, u.email as created_by_email 
            FROM Announcements a 
            JOIN Users u ON a.created_by = u.id 
            ORDER BY a.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

router.post('/announcements', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Announcements (title, content, created_by) VALUES (?, ?, ?)',
            [title, content, req.user.userId]
        );

        // Fetch all active users to notify them (both admins and employees)
        const [users] = await db.query("SELECT id as user_id FROM Users WHERE is_active = TRUE");

        if (users.length > 0) {
            const notifications = users.map(u => [u.user_id, `New Announcement: ${title}`, content.substring(0, 100) + (content.length > 100 ? '...' : '')]);
            await db.query(
                'INSERT INTO Notifications (user_id, title, message) VALUES ?',
                [notifications]
            );
        }

        res.status(201).json({ message: 'Announcement created and employees notified' });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Error creating announcement' });
    }
});

router.delete('/announcements/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM Announcements WHERE id = ?', [req.params.id]);
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement' });
    }
});

router.get('/profile', async (req, res) => {
    try {
        console.log('Fetching admin profile for user ID:', req.user.userId);
        const [rows] = await db.query('SELECT id, email, role FROM Users WHERE id = ?', [req.user.userId]);
        if (rows.length === 0) {
            console.log('Admin user not found in DB:', req.user.userId);
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Database error in admin profile:', error);
        res.status(500).json({ message: 'Error fetching admin profile' });
    }
});

module.exports = router;
