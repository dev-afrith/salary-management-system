import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import { useAuth } from '../../context/AuthContext';

const MainLayout = () => {
    const { user } = useAuth();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Sidebar role={user?.role} />
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Welcome back, <span className="uppercase">{user?.name || 'User'}</span>
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            Role: {user?.role}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
