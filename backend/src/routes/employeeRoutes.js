const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// Middleware to ensure user has an employee profile
const requireEmployeeProfile = async (req, res, next) => {
    if (!req.user.employeeId) {
        return res.status(403).json({ message: 'Employee profile not found for this user' });
    }
    next();
};

// --- Profile ---
router.get('/profile', requireEmployeeProfile, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT e.*, u.email FROM Employees e JOIN Users u ON e.user_id = u.id WHERE e.id = ?',
            [req.user.employeeId]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Profile not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// --- Salaries ---
router.get('/salaries', requireEmployeeProfile, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT s.*, e.first_name, e.last_name 
             FROM Salaries s 
             JOIN Employees e ON s.employee_id = e.id 
             WHERE s.employee_id = ? ORDER BY s.id DESC`,
            [req.user.employeeId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching salaries:', error);
        res.status(500).json({ message: 'Error fetching salaries' });
    }
});

// --- Leaves ---
router.get('/leaves', requireEmployeeProfile, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM LeaveRequests WHERE employee_id = ? ORDER BY applied_on DESC',
            [req.user.employeeId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaves' });
    }
});

router.post('/leaves', requireEmployeeProfile, async (req, res) => {
    const { leave_type, start_date, end_date, reason } = req.body;
    if (!leave_type || !start_date || !end_date) {
        return res.status(400).json({ message: 'Required fields missing' });
    }

    try {
        await db.query(
            'INSERT INTO LeaveRequests (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)',
            [req.user.employeeId, leave_type, start_date, end_date, reason]
        );

        // Notify Admin
        const [emps] = await db.query('SELECT first_name, last_name FROM Employees WHERE id = ?', [req.user.employeeId]);
        const employeeName = emps.length > 0 ? `${emps[0].first_name} ${emps[0].last_name}`.toUpperCase() : 'An employee';

        const [admins] = await db.query("SELECT id FROM Users WHERE role = 'admin'");
        if (admins.length > 0) {
            const notifications = admins.map(admin => [admin.id, 'New Leave Application', `${employeeName} has applied for ${leave_type} leave.`]);
            await db.query('INSERT INTO Notifications (user_id, title, message) VALUES ?', [notifications]);
        }

        res.status(201).json({ message: 'Leave request submitted and admin notified' });
    } catch (error) {
        console.error('Error submitting leave request:', error);
        res.status(500).json({ message: 'Error submitting leave request' });
    }
});

// --- Announcements ---
router.get('/announcements', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, u.email as created_by_email, 
                   IF(ar.user_id IS NULL, FALSE, TRUE) as is_read
            FROM Announcements a 
            JOIN Users u ON a.created_by = u.id 
            LEFT JOIN AnnouncementReads ar ON a.id = ar.announcement_id AND ar.user_id = ?
            ORDER BY a.created_at DESC
        `, [req.user.userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

router.post('/announcements/:id/read', async (req, res) => {
    try {
        await db.query(
            'INSERT IGNORE INTO AnnouncementReads (user_id, announcement_id) VALUES (?, ?)',
            [req.user.userId, req.params.id]
        );
        res.json({ message: 'Announcement marked as read' });
    } catch (error) {
        console.error('Error marking announcement as read:', error);
        res.status(500).json({ message: 'Error marking announcement as read' });
    }
});

// --- Notifications ---
router.get('/notifications', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

router.put('/notifications/:id/read', async (req, res) => {
    try {
        await db.query('UPDATE Notifications SET is_read = TRUE WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification' });
    }
});

router.put('/notifications/read-all', async (req, res) => {
    try {
        await db.query('UPDATE Notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE', [req.user.userId]);
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications' });
    }
});

module.exports = router;
