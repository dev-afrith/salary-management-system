require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'salary_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function migrate() {
    console.log('--- Starting Notifications Table Migration ---');

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(100) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Created Notifications table.');
    } catch (err) {
        console.error('❌ Error creating Notifications table:', err.message);
    }

    console.log('--- Migration Completed ---');
    process.exit(0);
}

migrate();
