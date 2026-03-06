import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveApplication = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        leave_type: 'Sick Leave',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const fetchLeaves = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/employee/leaves');
            setLeaves(res.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/employee/leaves', formData);
            alert('Leave requested successfully');
            setFormData({ leave_type: 'Sick Leave', start_date: '', end_date: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            alert('Failed to request leave.');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Approved</span>;
            case 'Rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Rejected</span>;
            default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">Apply for Leave</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">Leave Type</label>
                            <select
                                name="leave_type"
                                value={formData.leave_type}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            >
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Annual Leave">Annual Leave</option>
                                <option value="Casual Leave">Casual Leave</option>
                                <option value="Unpaid Leave">Unpaid Leave</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    required
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    required
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    className="w-full border p-3 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest">Reason for Leave</label>
                            <textarea
                                name="reason"
                                rows="4"
                                required
                                value={formData.reason}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                                placeholder="State your reason clearly..."
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all uppercase text-xs tracking-widest">
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="premium-table-container">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Leave History</h2>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{leaves.length} Records</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Duration</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-20 text-center opacity-30">No leave history found.</td>
                                    </tr>
                                ) : (
                                    leaves.map(l => (
                                        <tr key={l.id}>
                                            <td>
                                                <span className="font-black uppercase tracking-tight text-gray-900 dark:text-white">{l.leave_type}</span>
                                            </td>
                                            <td className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {l.start_date ? new Date(new Date(l.start_date).getTime() - (new Date(l.start_date).getTimezoneOffset() * 60000)).toLocaleDateString() : 'N/A'} - {l.end_date ? new Date(new Date(l.end_date).getTime() - (new Date(l.end_date).getTimezoneOffset() * 60000)).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {l.applied_on ? new Date(new Date(l.applied_on).getTime() - (new Date(l.applied_on).getTimezoneOffset() * 60000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                            </td>
                                            <td>
                                                <span className={`glass-badge ${l.status === 'Approved' ? 'glass-badge-green' :
                                                    l.status === 'Rejected' ? 'glass-badge-red' : 'glass-badge-yellow'
                                                    }`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveApplication;
