import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, Calendar, BellRing } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        employees: 0,
        pendingLeaves: 0,
        totalSalariesProcessed: 0,
        announcementsCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch basic counts from existing routes (could be optimized with a dedicated /stats route)
                const [empRes, leavesRes, salariesRes, annRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/employees'),
                    axios.get('http://localhost:5000/api/admin/leaves'),
                    axios.get('http://localhost:5000/api/admin/salaries'),
                    axios.get('http://localhost:5000/api/admin/announcements')
                ]);

                const pendingLeaves = leavesRes.data.filter(l => l.status === 'Pending').length;

                setStats({
                    employees: empRes.data.length,
                    pendingLeaves,
                    totalSalariesProcessed: salariesRes.data.length,
                    announcementsCount: annRes.data.length
                });
            } catch (error) {
                console.error("Error fetching admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    const cards = [
        { title: 'Total Employees', value: stats.employees, icon: <Users size={24} />, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/40' },
        { title: 'Pending Leaves', value: stats.pendingLeaves, icon: <Calendar size={24} />, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/40' },
        { title: 'Salaries Processed', value: stats.totalSalariesProcessed, icon: <FileText size={24} />, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/40' },
        { title: 'Active Announcements', value: stats.announcementsCount, icon: <BellRing size={24} />, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/40' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((k, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${k.bg} ${k.color}`}>
                                {k.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{k.title}</p>
                                <h3 className="text-2xl font-bold dark:text-white">{k.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="flex justify-center gap-4">
                    <a href="/admin/employees" className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg font-medium transition">Add Employee</a>
                    <a href="/admin/payroll" className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded-lg font-medium transition">Process Payroll</a>
                    <a href="/admin/announcements" className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg font-medium transition">Post Announcement</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
