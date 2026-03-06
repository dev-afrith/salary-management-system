import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Trash2 } from 'lucide-react';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/announcements');
            setAnnouncements(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/announcements', { title, content });
            setTitle('');
            setContent('');
            showToast('Announcement posted successfully', 'success');
            fetchAnnouncements();
        } catch (error) {
            showToast('Error creating announcement', 'error');
        }
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/announcements/${deleteId}`);
                showToast('Announcement deleted successfully', 'success');
                fetchAnnouncements();
            } catch (error) {
                showToast('Error deleting announcement', 'error');
            }
            setDeleteId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-opacity duration-300 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            {/* Modal for Deleting Announcement */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
                        <Trash2 className="mx-auto text-red-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold dark:text-white mb-2">Delete Announcement?</h3>
                        <p className="text-sm border-b pb-4 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                            Are you sure you want to permanently delete this announcement? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border rounded font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 shadow-md">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Megaphone size={20} className="text-blue-500" /> Post Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                            <input
                                required type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="E.g., Company Holiday"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Content</label>
                            <textarea
                                required rows="5"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Message body..."
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition">
                            Publish
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                <div className="premium-table-container">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Published Announcements</h2>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{announcements.length} Posts</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {announcements.map(ann => (
                            <div key={ann.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1 pr-12">{ann.title}</h3>
                                    <button
                                        onClick={() => setDeleteId(ann.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={16} strokeWidth={3} />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                                    {ann.content}
                                </p>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        {ann.created_by_email}
                                    </div>
                                    <span>{new Date(ann.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        ))}
                        {announcements.length === 0 && (
                            <div className="py-20 text-center">
                                <div className="flex flex-col items-center opacity-30">
                                    <Megaphone size={48} className="mb-4" />
                                    <p className="font-black uppercase tracking-widest text-xs">No announcements broadcasted</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Announcements;
