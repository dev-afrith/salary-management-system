import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Users, Trash2, Edit, UserX } from 'lucide-react';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [pastEmployees, setPastEmployees] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [formData, setFormData] = useState({
        email: '', password: '', first_name: '', last_name: '',
        department: 'Engineering', designation: 'Software Engineer', base_salary: '', joined_date: '',
        contact_number: '', birthdate: ''
    });

    const fetchEmployees = async () => {
        try {
            const [activeRes, pastRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/employees'),
                axios.get('http://localhost:5000/api/admin/employees/archive')
            ]);
            setEmployees(activeRes.data);
            setPastEmployees(pastRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleEdit = (emp) => {
        setFormData({
            email: emp.email,
            password: '',
            first_name: emp.first_name,
            last_name: emp.last_name,
            department: emp.department,
            designation: emp.designation,
            base_salary: emp.base_salary || '',
            joined_date: emp.joined_date ? new Date(new Date(emp.joined_date).getTime() - (new Date(emp.joined_date).getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '',
            contact_number: emp.contact_number || '',
            birthdate: emp.birthdate ? new Date(new Date(emp.birthdate).getTime() - (new Date(emp.birthdate).getTimezoneOffset() * 60000)).toISOString().split('T')[0] : ''
        });
        setEditId(emp.id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditId(null);
        setFormData({
            email: '', password: '', first_name: '', last_name: '',
            department: 'Engineering', designation: 'Software Engineer', base_salary: '', joined_date: '',
            contact_number: '', birthdate: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:5000/api/admin/employees/${editId}`, formData);
                showToast('Employee updated successfully!', 'success');
            } else {
                await axios.post('http://localhost:5000/api/admin/employees', formData);
                showToast('Employee created successfully!', 'success');
            }
            handleCloseModal();
            fetchEmployees();
        } catch (error) {
            showToast(error.response?.data?.message || 'Error occurred while saving', 'error');
        }
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/employees/${deleteId}`);
                showToast('Employee archived successfully', 'success');
                fetchEmployees();
            } catch (error) {
                showToast('Error archiving employee', 'error');
            }
            setDeleteId(null);
        }
    };

    const displayedEmployees = activeTab === 'active' ? employees : pastEmployees;

    return (
        <div className="space-y-6 relative">
            {/* Custom Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg font-medium text-white transition-opacity duration-300 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            {/* Modal for Deleting Employee */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
                        <UserX className="mx-auto text-red-500 mb-4" size={48} />
                        <h3 className="text-lg font-bold dark:text-white mb-2">Archive Employee?</h3>
                        <p className="text-sm border-b pb-4 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 mb-4">
                            Are you sure you want to archive this employee? Their account will be deactivated and they will be moved to Past Employees.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border rounded font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 shadow-md">Yes, Archive</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        <Users size={24} className="text-blue-500" /> Employee Directory
                    </h2>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${activeTab === 'active' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${activeTab === 'past' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            Past Employees
                        </button>
                    </div>
                </div>
                {activeTab === 'active' && (
                    <button
                        onClick={() => { setEditId(null); setShowModal(true); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
                        <Plus size={20} /> Add Employee
                    </button>
                )}
            </div>

            {/* Modal for creating/editing employee */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between">
                            <h3 className="text-lg font-bold dark:text-white">{editId ? 'Edit Employee Details' : 'Onboard New Employee'}</h3>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name</label>
                                    <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name</label>
                                    <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div className={`grid ${editId ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email (User Login)</label>
                                    <input required={!editId} disabled={!!editId} type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ${editId ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                </div>
                                {!editId && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Initial Password</label>
                                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300 uppercase text-[10px] tracking-widest font-black">Contact Number</label>
                                    <input required type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full border p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300 uppercase text-[10px] tracking-widest font-black">Birthdate</label>
                                    <input required type="date" name="birthdate" max={new Date().toISOString().split('T')[0]} value={formData.birthdate} onChange={handleChange} className="w-full border p-3 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all font-medium" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Department</label>
                                    <select name="department" value={formData.department} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option value="Engineering">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="HR">HR</option>
                                        <option value="Sales">Sales</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Designation</label>
                                    <select name="designation" value={formData.designation} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                        <option value="Software Engineer">Software Engineer</option>
                                        <option value="Senior Developer">Senior Developer</option>
                                        <option value="Marketing Specialist">Marketing Specialist</option>
                                        <option value="HR Manager">HR Manager</option>
                                        <option value="Sales Executive">Sales Executive</option>
                                        <option value="Product Manager">Product Manager</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Base Salary ($)</label>
                                    <input required type="number" step="0.01" name="base_salary" value={formData.base_salary} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Joined Date</label>
                                    <input required type="date" name="joined_date" value={formData.joined_date} onChange={handleChange} className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 border rounded font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700">{editId ? 'Save Changes' : 'Save Employee'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="premium-table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Employee Name</th>
                            <th>Email & Contact</th>
                            <th>Department</th>
                            <th>Monthly Salary</th>
                            {activeTab === 'active' && <th className="text-center">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {displayedEmployees.map((emp, idx) => {
                            const birthDate = emp.birthdate ? new Date(emp.birthdate) : null;
                            const age = birthDate ? (new Date().getFullYear() - birthDate.getFullYear()) : null;

                            return (
                                <tr key={emp.id}>
                                    <td className="font-black text-gray-400">{(idx + 1).toString().padStart(2, '0')}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-black uppercase tracking-tighter text-gray-900 dark:text-white text-base">
                                                {emp.first_name} {emp.last_name}
                                            </span>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                                {emp.designation} • {emp.birthdate ? `${new Date().getFullYear() - new Date(emp.birthdate).getFullYear()} Years` : 'Age N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1">
                                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{emp.email}</div>
                                            <div className="text-[10px] font-black tracking-widest text-gray-400">{emp.contact_number}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`glass-badge ${emp.department === 'Engineering' ? 'glass-badge-blue' :
                                            emp.department === 'Marketing' ? 'glass-badge-yellow' :
                                                emp.department === 'HR' ? 'glass-badge-green' : 'glass-badge-blue'
                                            }`}>
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="font-black text-gray-900 dark:text-white">
                                            ${parseFloat(emp.base_salary).toLocaleString()}
                                        </div>
                                    </td>
                                    {activeTab === 'active' && (
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(emp)}
                                                    className="p-2.5 bg-gray-50 dark:bg-gray-800 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                                >
                                                    <Edit size={16} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(emp.id)}
                                                    className="p-2.5 bg-gray-50 dark:bg-gray-800 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                                >
                                                    <UserX size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {displayedEmployees.length === 0 && (
                            <tr>
                                <td colSpan={activeTab === 'active' ? 6 : 5} className="py-20 text-center">
                                    <div className="flex flex-col items-center opacity-40">
                                        <Users size={48} className="mb-4" />
                                        <p className="font-black uppercase tracking-widest text-xs">No employees found in directory</p>
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

export default EmployeeManagement;
