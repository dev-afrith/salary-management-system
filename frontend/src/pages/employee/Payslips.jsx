import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, FileText, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '../../context/AuthContext';

const Payslips = () => {
    const { user } = useAuth();
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [showSlipModal, setShowSlipModal] = useState(false);
    const slipRef = useRef(null);

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/employee/salaries');
                setSalaries(res.data);
            } catch (error) {
                console.error('Error fetching salaries:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSalaries();
    }, []);

    const openSlipModal = (slip) => {
        setSelectedSlip(slip);
        setShowSlipModal(true);
    };

    const handleDownloadPDF = async () => {
        if (!slipRef.current) return;

        try {
            const canvas = await html2canvas(slipRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Payslip_${selectedSlip.month_year.replace(' ', '_')}.pdf`);
        } catch (error) {
            console.error('Error generating PDF', error);
        }
    };

    if (loading) return <div>Loading payslips...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative">

            {/* View/Download Slip Modal */}
            {showSlipModal && selectedSlip && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-xl">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <FileText className="text-blue-500" /> Payslip Options
                            </h3>
                            <button onClick={() => setShowSlipModal(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Slip Content View (Scrollable) */}
                        <div className="p-8 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex-1">
                            <div ref={slipRef} className="bg-white p-10 shadow-2xl rounded-sm max-w-2xl mx-auto text-gray-900 border-[12px] border-gray-100 font-sans">
                                {/* Header */}
                                <div className="flex justify-between items-start border-b-4 border-blue-600 pb-6 mb-8">
                                    <div>
                                        <h1 className="text-3xl font-black uppercase tracking-tighter text-blue-700 italic">Enterprise Corp</h1>
                                        <p className="text-xs text-gray-400 font-bold tracking-widest mt-1 uppercase">Human Resources Division</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-blue-600 text-white px-4 py-1 text-xs font-black uppercase tracking-widest mb-2 inline-block">Official Pay Slip</div>
                                        <p className="text-sm font-bold text-gray-500 uppercase">Period: <span className="text-blue-600">{selectedSlip.month_year}</span></p>
                                    </div>
                                </div>

                                {/* Employee & Company Info Grid */}
                                <div className="grid grid-cols-2 gap-8 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Employee Information</p>
                                        <table className="w-full text-xs">
                                            <tbody>
                                                <tr>
                                                    <td className="py-1 text-gray-500 font-bold uppercase">Name</td>
                                                    <td className="py-1 text-right font-black text-gray-900 uppercase text-sm">
                                                        {selectedSlip.first_name ? `${selectedSlip.first_name} ${selectedSlip.last_name}` : (user?.name || 'Employee')}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 text-gray-500 font-bold uppercase">Emp ID</td>
                                                    <td className="py-1 text-right font-black text-gray-900">EMP-{selectedSlip.employee_id?.toString().padStart(4, '0')}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="border-l border-gray-200 pl-8">
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Payment Details</p>
                                        <table className="w-full text-xs">
                                            <tbody>
                                                <tr>
                                                    <td className="py-1 text-gray-500 font-bold uppercase">Statement Date</td>
                                                    <td className="py-1 text-right font-black text-gray-900">{new Date().toLocaleDateString()}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 text-gray-500 font-bold uppercase">Status</td>
                                                    <td className="py-1 text-right font-black text-emerald-600">PAID</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Earnings & Deductions Table */}
                                <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-900 text-white text-[10px] uppercase tracking-widest">
                                                <th className="px-6 py-3 text-left">Description</th>
                                                <th className="px-6 py-3 text-right">Earnings</th>
                                                <th className="px-6 py-3 text-right">Deductions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-gray-700">Basic Salary</td>
                                                <td className="px-6 py-3 text-right font-black text-gray-900">${parseFloat(selectedSlip.base_amount).toFixed(2)}</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-gray-700">HRA (House Rent Allowance)</td>
                                                <td className="px-6 py-3 text-right font-black text-emerald-600">+ ${parseFloat(selectedSlip.hra || 0).toFixed(2)}</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-gray-700">DA (Dearness Allowance)</td>
                                                <td className="px-6 py-3 text-right font-black text-emerald-600">+ ${parseFloat(selectedSlip.da || 0).toFixed(2)}</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-gray-700">Performance Bonus/Other</td>
                                                <td className="px-6 py-3 text-right font-black text-emerald-600">+ ${parseFloat(selectedSlip.bonus || 0).toFixed(2)}</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                            </tr>
                                            <tr className="bg-gray-50/50">
                                                <td className="px-6 py-3 font-black text-gray-900 uppercase text-[10px] tracking-widest">Gross Earnings</td>
                                                <td className="px-6 py-3 text-right font-black text-gray-900">${(parseFloat(selectedSlip.base_amount) + parseFloat(selectedSlip.hra || 0) + parseFloat(selectedSlip.da || 0) + parseFloat(selectedSlip.bonus || 0)).toFixed(2)}</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-red-700">Provident Fund (PF)</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                                <td className="px-6 py-3 text-right font-black text-red-600">- ${parseFloat(selectedSlip.pf || 0).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-red-700">LOP Deduction (Leaves)</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                                <td className="px-6 py-3 text-right font-black text-red-600">- ${parseFloat(selectedSlip.lop_deduction || 0).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 font-bold text-red-700">Other Miscellaneous Deductions</td>
                                                <td className="px-6 py-3 text-right text-gray-300">-</td>
                                                <td className="px-6 py-3 text-right font-black text-red-600">- ${parseFloat(selectedSlip.deductions || 0).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-blue-600 text-white">
                                                <td className="px-6 py-5 font-black uppercase tracking-widest text-xs">Net Salary Transferred</td>
                                                <td colSpan="2" className="px-6 py-5 text-right font-black text-2xl tracking-tighter">
                                                    ${parseFloat(selectedSlip.net_salary).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Footer Note */}
                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                                    <div className="text-[9px] text-gray-400 leading-relaxed max-w-[240px]">
                                        <p className="font-bold mb-1 uppercase tracking-widest text-gray-500 transition-colors">Important Notice:</p>
                                        This is a system-generated electronic document and does not require a physical signature. Any discrepancies should be reported to the HR department within 48 hours of receipt.
                                    </div>
                                    <div className="flex flex-col items-end justify-center">
                                        <div className="w-32 h-12 border-b-2 border-gray-200 mb-2 opacity-50 grayscale contrast-125">
                                            {/* Area for digital stamp/sign if needed */}
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Authorized Electronic Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Sticky) */}
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky bottom-0 z-10 rounded-b-xl flex justify-end gap-4">
                            <button onClick={() => setShowSlipModal(false)} className="px-6 py-2 border rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                Close
                            </button>
                            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">
                                <Download size={18} /> Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="premium-table-container">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">My Salary Slips</h2>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">{salaries.length} Records</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Month/Year</th>
                                <th>Base Salary</th>
                                <th>Bonus</th>
                                <th>Deductions</th>
                                <th>Net Salary</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <FileText size={48} className="mb-4" />
                                            <p className="font-black uppercase tracking-widest text-xs">No payslips generated yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                salaries.map(s => (
                                    <tr key={s.id}>
                                        <td>
                                            <span className="glass-badge glass-badge-blue">{s.month_year}</span>
                                        </td>
                                        <td className="font-medium text-gray-500 dark:text-gray-400">${parseFloat(s.base_amount).toLocaleString()}</td>
                                        <td className="font-black text-green-600">+${parseFloat(s.bonus).toLocaleString()}</td>
                                        <td className="font-black text-red-600">-${parseFloat(s.deductions).toLocaleString()}</td>
                                        <td>
                                            <div className="font-black text-blue-600 dark:text-blue-400 text-base">
                                                ${parseFloat(s.net_salary).toLocaleString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => openSlipModal(s)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-black uppercase text-[10px] tracking-widest border border-gray-100 dark:border-gray-700"
                                                >
                                                    <FileText size={14} strokeWidth={3} />
                                                    View Slip
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payslips;
