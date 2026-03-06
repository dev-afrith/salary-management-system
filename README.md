# 🚀 Enterprise HR & Salary Management System

A comprehensive, full-stack HR and Payroll platform designed with a modern, high-end "Unified Portal" aesthetic. Built with React, Node.js, and MySQL.

## ✨ Features

### 🏛️ Unified Portal Login
- **Glassmorphism UI:** Stunning frosted-glass design with glowing accents.
- **Dynamic Background:** Animated isometric network map with pulsing clusters.
- **Secure Recovery:** Phone-verified password reset flow for enhanced security.
- **"Remember Me":** Intelligent session persistence for returning users.

### 👥 Employee Management
- **Full Lifecycle:** Onboarding, editing, and archiving (soft deletes).
- **Sorting & Filtering:** Employees ordered by ID with department-wise views.
- **Phone Support:** Integrated phone number management for simplified communication and security.

### 💰 Payroll & Salary Engine
- **Automated Processing:** Batch salary generation with one-click processing.
- **Detailed Breakdowns:** HRA, DA, PF, and LOP (Loss of Pay) calculations.
- **Payslip Management:** Digital payslip viewing and downloadable PDF formats.

### 🔔 In-App Notifications
- **Real-time Updates:** Automated alerts for salary credits and announcements.
- **Unread Tracking:** Notification bell with badge count and mark-as-read functionality.

## 📸 Screenshots

| Login Page | Admin Dashboard |
| :---: | :---: |
| ![Login](./github_readme/login.png) | ![Dashboard](./github_readme/dashboard.png) |

| Employee Directory |
| :---: |
| ![Directory](./github_readme/directory.png) |

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, JWT Authentication, Bcrypt.
- **Database:** MySQL.

## 🚀 Getting Started

1. **Clone the repository.**
2. **Setup Database:** Run the scripts in the `database/` folder.
3. **Frontend:** 
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## 💡 Suggestions for Future Enhancements
- **Face Recognition Attendance:** Integrating AI-based attendance marking.
- **Bulk Import/Export:** CSV/Excel support for large employee datasets.
- **Multi-Currency Support:** For international payroll management.
- **Employee Performance Tracking:** KPI and Review modules.
