import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const fetchLeaves = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/leaves');
            setLeaves(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/leaves/${id}`, { status });
            showToast(`Leave request ${status.toLowerCase()} successfully`, 'success');
            fetchLeaves();
        } catch (error) {
            showToast('Failed to update status', 'error');
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
        <div className="premium-table-container relative">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-black text-[10px] uppercase tracking-widest text-white transition-opacity duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Leave Requests</h2>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{leaves.length} Pending Approval</span>
            </div>
            <div className="overflow-x-auto">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Leave Details</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th className="text-center">Review</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map(l => (
                            <tr key={l.id}>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-black uppercase tracking-tight text-gray-900 dark:text-white">{l.first_name} {l.last_name}</span>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{l.department}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight">{l.leave_type}</div>
                                        <div className="text-[11px] text-gray-500 line-clamp-1 max-w-[200px]" title={l.reason}>{l.reason}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                                        {l.start_date ? new Date(new Date(l.start_date).getTime() - (new Date(l.start_date).getTimezoneOffset() * 60000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'} - {l.end_date ? new Date(new Date(l.end_date).getTime() - (new Date(l.end_date).getTimezoneOffset() * 60000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                    </div>
                                </td>
                                <td>
                                    <span className={`glass-badge ${l.status === 'Approved' ? 'glass-badge-green' :
                                        l.status === 'Rejected' ? 'glass-badge-red' : 'glass-badge-yellow'
                                        }`}>
                                        {l.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => updateStatus(l.id, 'Approved')}
                                            className={`p-2 rounded-xl border transition-all ${l.status === 'Approved' ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'}`}
                                            title="Approve Request"
                                            disabled={l.status === 'Approved'}
                                        >
                                            <Check size={18} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => updateStatus(l.id, 'Rejected')}
                                            className={`p-2 rounded-xl border transition-all ${l.status === 'Rejected' ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white'}`}
                                            title="Reject Request"
                                            disabled={l.status === 'Rejected'}
                                        >
                                            <X size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-20 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <Check size={48} className="mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs">All clear! No pending leave requests</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveManagement;
