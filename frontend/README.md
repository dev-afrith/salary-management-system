# 🎨 Frontend – HR & Salary Management System

This folder contains the **frontend application** for the **Enterprise HR & Salary Management System**.

The frontend is built using **React, Vite, and Tailwind CSS** to provide a fast, responsive, and modern user interface for administrators and employees.

---

## 🚀 Features

The frontend application provides the UI for:

* 🔐 Secure login system
* 📊 Admin dashboard
* 👥 Employee directory
* 💰 Payroll management
* 📄 Payslip viewing
* 🔔 Notification system

It communicates with the **Node.js backend API** to fetch and manage data.

---

## 🛠️ Tech Stack

* **React** – UI library
* **Vite** – Fast development build tool
* **Tailwind CSS** – Utility-first styling
* **Lucide Icons** – Icon library
* **Axios / Fetch API** – API communication

---

## 📂 Project Structure

```
frontend
│
├── public/             # Static files
├── src/                # Main source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── assets/         # Images & static assets
│   ├── styles/         # Global styles
│   └── main.jsx        # React entry point
│
├── index.html          # HTML template
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js      # Vite configuration
```

---

## ⚙️ Installation

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Run Development Server

Start the frontend development server:

```bash
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

## 🔗 Backend Connection

Make sure the **backend server is running** before using the frontend.

Default backend API:

```
http://localhost:5000
```

The frontend sends API requests to this server for:

* authentication
* employee data
* payroll data
* notifications

---

## 🧩 Build for Production

To create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 👨‍💻 Developer

**Muhammad Afrith**

Frontend Developer
Passionate about **React, UI/UX, and Full-Stack Development**.
