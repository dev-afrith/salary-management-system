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
    console.log('--- Starting Database Migration ---');

    // 1. Alter Employees Table
    try {
        await pool.query("ALTER TABLE Employees ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active'");
        console.log('✅ Added `status` column to Employees table.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('⏩ `status` column already exists in Employees. Skipping.');
        } else {
            console.error('❌ Error altering Employees table:', err.message);
        }
    }

    // 2. Alter Users Table
    try {
        await pool.query("ALTER TABLE Users ADD COLUMN is_active BOOLEAN DEFAULT TRUE");
        console.log('✅ Added `is_active` column to Users table.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('⏩ `is_active` column already exists in Users. Skipping.');
        } else {
            console.error('❌ Error altering Users table:', err.message);
        }
    }

    // 3. Alter Salaries Table
    try {
        await pool.query(`
            ALTER TABLE Salaries 
            ADD COLUMN hra DECIMAL(10, 2) DEFAULT 0.00,
            ADD COLUMN da DECIMAL(10, 2) DEFAULT 0.00,
            ADD COLUMN pf DECIMAL(10, 2) DEFAULT 0.00,
            ADD COLUMN lop_deduction DECIMAL(10, 2) DEFAULT 0.00
        `);
        console.log('✅ Added `hra`, `da`, `pf`, `lop_deduction` to Salaries table.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('⏩ Salary columns already exist (hra, da, pf, lop). Skipping.');
        } else {
            console.error('❌ Error altering Salaries table:', err.message);
        }
    }

    console.log('--- Migration Completed ---');
    process.exit(0);
}

migrate();
