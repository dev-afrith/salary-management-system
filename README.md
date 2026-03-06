# 🚀 Enterprise HR & Salary Management System

A comprehensive **full-stack HR and Payroll Management platform** designed to simplify employee management, payroll automation, and organizational workflows.

Built with **React, Node.js, Express, and MySQL**, this system provides a modern administrative dashboard and efficient tools for managing employee data and salary processing.

---

# 📌 Overview

The **Enterprise HR & Salary Management System** helps organizations automate and manage HR operations through a centralized web application.

The system allows administrators to:

* Manage employee records
* Process payroll automatically
* Generate and download payslips
* Track employee information
* Monitor salary transactions
* Use a modern dashboard interface

The project focuses on **automation, usability, and scalability**.

---

# ✨ Key Features

## 🏛 Unified Portal Login

* Secure **Admin & Employee authentication**
* **JWT-based authentication**
* Password encryption using **bcrypt**
* Secure password recovery flow
* Remember-me login functionality

---

## 👥 Employee Management

* Add new employees
* Edit employee details
* Delete or archive employee records
* Department-based organization
* Employee directory with sorting and filtering
* Store employee contact details

---

## 💰 Payroll & Salary Engine

* Automated payroll generation

* Salary calculation system

* Salary components include:

  * Basic Salary
  * HRA (House Rent Allowance)
  * DA (Dearness Allowance)
  * PF (Provident Fund)
  * LOP (Loss of Pay)

* Batch salary processing

* Monthly payroll tracking

---

## 📄 Payslip Generation

* Digital payslip generation
* Salary breakdown visibility
* Download payslips as **PDF**
* Organized salary history

---

## 🔔 In-App Notifications

* Real-time system notifications
* Salary credit alerts
* Administrative announcements
* Notification badge tracking

---

# 📸 Screenshots

| Login Page                                                                                                 | Admin Dashboard                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| ![Login](https://raw.githubusercontent.com/dev-afrith/salary-management-system/main/screenshots/login.png) | ![Dashboard](https://raw.githubusercontent.com/dev-afrith/salary-management-system/main/screenshots/dashboard.png) |

| Employee Directory                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------ |
| ![Directory](https://raw.githubusercontent.com/dev-afrith/salary-management-system/main/screenshots/directory.png) |

---

# 🏗 Project Structure

```
salary-management-system
│
├── backend/            # Node.js + Express backend
├── frontend/           # React + Vite frontend
├── database/           # MySQL database scripts
├── screenshots/        # Images used in README
│   ├── login.png
│   ├── dashboard.png
│   └── directory.png
│
├── .gitignore
└── README.md
```

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Lucide Icons

## Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt (Password Hashing)

## Database

* MySQL

---

# ⚙ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/dev-afrith/salary-management-system.git
cd salary-management-system
```

---

## 2️⃣ Setup Database

Open **MySQL** and create a new database.

```sql
CREATE DATABASE salary_management;
```

Then run the SQL scripts located in the **database/** folder.

---

## 3️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend server will start at:

```
http://localhost:5000
```

---

## 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **backend** folder.

Example configuration:

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=salary_management

JWT_SECRET=your_secret_key
```

---

# 🚀 Future Enhancements

Possible upgrades for the project:

* 🤖 AI Face Recognition Attendance System
* 📊 Employee Performance Tracking
* 📁 Bulk Import / Export (Excel / CSV)
* 🌍 Multi-Currency Payroll Support
* 📅 Leave Management System
* 📱 Mobile Responsive Employee Portal

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```
git checkout -b feature-name
```

3. Commit your changes

```
git commit -m "Added new feature"
```

4. Push to your branch

```
git push origin feature-name
```

5. Create a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Muhammad Afrith**

Full Stack Developer
Passionate about **Web Development, Software Systems, and AI**

---

⭐ If you like this project, consider **starring the repository on GitHub**.
