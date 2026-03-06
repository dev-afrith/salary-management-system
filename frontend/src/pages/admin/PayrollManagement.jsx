import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Calculator } from 'lucide-react';
import MonthYearPicker from '../../components/shared/MonthYearPicker';

const PayrollManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [salaries, setSalaries] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [monthYear, setMonthYear] = useState('');
    const [bonus, setBonus] = useState(0);
    const [deductions, setDeductions] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [previewData, setPreviewData] = useState(null);

    const fetchData = async () => {
        try {
            const [empRes, salRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/employees'),
                axios.get('http://localhost:5000/api/admin/salaries')
            ]);
            setEmployees(empRes.data);
            setSalaries(salRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
        // Set default month year (e.g., March 2026)
        const date = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        setMonthYear(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
    }, []);

    useEffect(() => {
        const fetchPreview = async () => {
            if (!selectedEmployee || !monthYear) {
                setPreviewData(null);
                return;
            }
            try {
                const res = await axios.post('http://localhost:5000/api/admin/payroll/preview', {
                    employee_id: selectedEmployee,
                    month_year: monthYear,
                    bonus: parseFloat(bonus) || 0,
                    deductions: parseFloat(deductions) || 0
                });
                setPreviewData(res.data);
            } catch (error) {
                console.error('Error fetching preview:', error);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchPreview();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [selectedEmployee, monthYear, bonus, deductions]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/payroll/generate', {
                employee_id: selectedEmployee,
                month_year: monthYear,
                bonus: parseFloat(bonus),
                deductions: parseFloat(deductions)
            });
            showToast('Payroll generated successfully!', 'success');
            fetchData();
            setBonus(0);
            setDeductions(0);
        } catch (error) {
            showToast(error.response?.data?.message || 'Error generating payroll', 'error');
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

            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-500" /> Generate Payroll
                    </h2>
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Employee</label>
                            <select
                                required
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Select Employee</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.department})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Month / Year</label>
                            <MonthYearPicker
                                value={monthYear}
                                onChange={(val) => setMonthYear(val)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Bonus ($)</label>
                                <input
                                    type="number" step="0.01" min="0"
                                    value={bonus}
                                    onChange={(e) => setBonus(e.target.value)}
                                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Deductions ($)</label>
                                <input
                                    type="number" step="0.01" min="0"
                                    value={deductions}
                                    onChange={(e) => setDeductions(e.target.value)}
                                    className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 transition">
                            Process Salary
                        </button>
                    </form>

                    {previewData && (
                        <div className="mt-6 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600 text-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Calculator size={16} className="text-blue-600 dark:text-blue-400" />
                                Live Calculation Preview
                            </h3>
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between"><span>Base Salary:</span> <span className="font-medium">${previewData.base_amount.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>HRA (40%):</span> <span className="font-medium text-green-600">+ ${previewData.hra.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>DA (10%):</span> <span className="font-medium text-green-600">+ ${previewData.da.toFixed(2)}</span></div>
                                <div className="flex justify-between border-t border-blue-200 dark:border-gray-600 pt-2 font-semibold">
                                    <span>Gross Salary:</span> <span>${previewData.gross.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-red-500"><span>PF (12%):</span> <span>- ${previewData.pf.toFixed(2)}</span></div>
                                {previewData.lop_deduction > 0 && (
                                    <div className="flex justify-between text-red-500"><span>Loss of Pay (Unpaid Leave):</span> <span>- ${previewData.lop_deduction.toFixed(2)}</span></div>
                                )}
                                {parseFloat(deductions) > 0 && (
                                    <div className="flex justify-between text-red-500"><span>Manual Deductions:</span> <span>- ${parseFloat(deductions).toFixed(2)}</span></div>
                                )}
                                {parseFloat(bonus) > 0 && (
                                    <div className="flex justify-between text-green-600"><span>Manual Bonus:</span> <span>+ ${parseFloat(bonus).toFixed(2)}</span></div>
                                )}
                                <div className="flex justify-between border-t border-blue-200 dark:border-gray-600 pt-2 text-base font-bold text-gray-900 dark:text-white mt-1">
                                    <span>Net Payable:</span> <span className="text-blue-600 dark:text-blue-400">${previewData.net_salary.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="premium-table-container">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">Processed Payrolls</h2>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{salaries.length} Records</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Employee</th>
                                    <th>Pay Period</th>
                                    <th>Base Amount</th>
                                    <th>Net Payable</th>
                                    <th>Issued Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaries.map((s, idx) => (
                                    <tr key={s.id}>
                                        <td className="font-black text-gray-400">{(idx + 1).toString().padStart(2, '0')}</td>
                                        <td>
                                            <div className="font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                                {s.first_name} {s.last_name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="glass-badge glass-badge-blue">
                                                {s.month_year}
                                            </span>
                                        </td>
                                        <td className="font-medium text-gray-500 dark:text-gray-400">
                                            ${parseFloat(s.base_amount).toLocaleString()}
                                        </td>
                                        <td>
                                            <div className="font-black text-green-600 dark:text-green-400 text-base">
                                                ${parseFloat(s.net_salary).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="text-[10px] font-bold text-gray-400 uppercase">
                                            {s.processed_date ? new Date(new Date(s.processed_date).getTime() - (new Date(s.processed_date).getTimezoneOffset() * 60000)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                {salaries.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="flex flex-col items-center opacity-30">
                                                <DollarSign size={48} className="mb-4" />
                                                <p className="font-black uppercase tracking-widest text-xs">No payroll records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollManagement;
