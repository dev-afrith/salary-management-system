import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, CalendarSync, Receipt, Megaphone, LogOut, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = ({ role }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Employees', path: '/admin/employees', icon: <Users size={20} /> },
        { name: 'Leave Requests', path: '/admin/leaves', icon: <CalendarSync size={20} /> },
        { name: 'Payroll', path: '/admin/payroll', icon: <Receipt size={20} /> },
        { name: 'Announcements', path: '/admin/announcements', icon: <Megaphone size={20} /> },
        { name: 'Profile', path: '/admin/profile', icon: <User size={20} /> },
    ];

    const employeeLinks = [
        { name: 'Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Leave Application', path: '/employee/leaves', icon: <CalendarSync size={20} /> },
        { name: 'My Payslips', path: '/employee/payslips', icon: <Receipt size={20} /> },
        { name: 'Profile', path: '/employee/profile', icon: <User size={20} /> },
    ];

    const links = role === 'admin' ? adminLinks : employeeLinks;

    return (
        <div className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between h-full">
            <div>
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-900">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-500 uppercase">
                        {role === 'admin' ? 'Admin Portal' : 'Employee Portal'}
                    </span>
                </div>
                <nav className="p-4 space-y-2">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                )}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-900">
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
