import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Briefcase, CalendarDays, DollarSign, X } from 'lucide-react';

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const fetchData = async () => {
        try {
            const [profRes, annRes] = await Promise.all([
                axios.get('http://localhost:5000/api/employee/profile'),
                axios.get('http://localhost:5000/api/employee/announcements')
            ]);
            setProfile(profRes.data);
            setAnnouncements(annRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/employee/announcements/${id}/read`);
            fetchData();
            setSelectedAnnouncement(null);
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (!profile) return <div>Ready to setup employee profile! Please contact admin.</div>;

    return (
        <div className="space-y-6">
            {/* Announcement Modal */}
            {selectedAnnouncement && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{selectedAnnouncement.title}</h2>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">
                                        Posted on {selectedAnnouncement.created_at ? new Date(new Date(selectedAnnouncement.created_at).getTime() - (new Date(selectedAnnouncement.created_at).getTimezoneOffset() * 60000)).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedAnnouncement(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 group"
                                >
                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                                </button>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedAnnouncement.content}
                                </p>
                            </div>
                            <div className="mt-10 flex gap-3">
                                {!selectedAnnouncement.is_read && (
                                    <button
                                        onClick={() => markAsRead(selectedAnnouncement.id)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                                    >
                                        Mark as Read
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedAnnouncement(null)}
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* ... existing stats ... */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400">Employee ID</p>
                            <h3 className="text-xl font-bold dark:text-white">EMP-{profile.id.toString().padStart(4, '0')}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400">Department</p>
                            <h3 className="text-xl font-bold dark:text-white truncate">{profile.department}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400">Base Salary</p>
                            <h3 className="text-xl font-bold dark:text-white">${parseFloat(profile.base_salary).toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 rounded-lg">
                            <CalendarDays size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 hover:text-gray-600 dark:text-gray-400">Joined Date</p>
                            <h3 className="text-xl font-bold dark:text-white truncate">{profile.joined_date ? new Date(new Date(profile.joined_date).getTime() - (new Date(profile.joined_date).getTimezoneOffset() * 60000)).toLocaleDateString() : 'N/A'}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="premium-table-container">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Active Announcements</h2>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{announcements.length} Posts</span>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {announcements.length === 0 ? (
                        <div className="py-20 text-center opacity-30">No active announcements.</div>
                    ) : (
                        announcements.map((ann) => (
                            <div
                                key={ann.id}
                                onClick={() => setSelectedAnnouncement(ann)}
                                className={`p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all cursor-pointer relative group border-l-4 ${!ann.is_read ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-900/10' : 'border-transparent'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className={`text-base font-black uppercase tracking-tight ${!ann.is_read ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                            {ann.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 max-w-4xl leading-relaxed mb-4">{ann.content}</p>
                                    </div>
                                    {!ann.is_read && (
                                        <span className="glass-badge glass-badge-blue">New</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Posted on {ann.created_at ? new Date(new Date(ann.created_at).getTime() - (new Date(ann.created_at).getTimezoneOffset() * 60000)).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
