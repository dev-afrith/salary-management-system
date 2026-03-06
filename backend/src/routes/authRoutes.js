const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Fetch Employee Details if employee
        let employeeId = null;
        let name = 'Admin';

        if (user.role === 'employee') {
            const [employees] = await db.query('SELECT id, first_name, last_name FROM Employees WHERE user_id = ?', [user.id]);
            if (employees.length > 0) {
                employeeId = employees[0].id;
                name = `${employees[0].first_name} ${employees[0].last_name}`;
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role, employeeId, name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name,
                employeeId
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

router.post('/verify-reset', async (req, res) => {
    try {
        const { email, phone, newPassword } = req.body;

        if (!email || !phone || !newPassword) {
            return res.status(400).json({ message: 'Email, phone, and new password are required' });
        }

        // Verify if email in Users matches phone in Employees
        const [rows] = await db.query(`
            SELECT u.id 
            FROM Users u 
            JOIN Employees e ON u.id = e.user_id 
            WHERE u.email = ? AND e.phone = ?
        `, [email, phone]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userId = rows[0].id;
        const passwordHash = await bcrypt.hash(newPassword, 10);

        await db.query('UPDATE Users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
});

module.exports = router;
