import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/employee/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/employee/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('http://localhost:5000/api/employee/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-gray-900 animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-[100] overflow-hidden flex flex-col max-h-[500px]">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                        <div>
                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-lg">Notifications</h3>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{unreadCount} New Messages</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-full transition-all"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="mx-auto text-gray-200 dark:text-gray-800 mb-4" size={48} />
                                <p className="text-gray-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest">All caught up!</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "p-6 transition-all relative group border-l-4",
                                        !n.is_read ? "bg-blue-50/20 dark:bg-blue-900/10 border-blue-600" : "hover:bg-gray-50 dark:hover:bg-gray-800/20 border-transparent opacity-60"
                                    )}
                                >
                                    <div className="flex justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className={cn("text-xs font-black uppercase tracking-widest", !n.is_read ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white")}>
                                                    {n.title}
                                                </p>
                                                {!n.is_read && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-normal font-medium mb-4">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                                                    {new Date(n.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                                </p>
                                                {!n.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(n.id)}
                                                        className="text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1 group/btn"
                                                    >
                                                        Mark as Read <Check size={10} strokeWidth={4} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Recent Activity Log</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
