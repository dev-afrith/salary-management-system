import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MonthYearPicker = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Parse current value (e.g., "March 2026")
    const [currentMonth, currentYear] = value.split(' ');
    const initialYear = parseInt(currentYear) || new Date().getFullYear();
    const [viewYear, setViewYear] = useState(initialYear);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMonthSelect = (month) => {
        onChange(`${month} ${viewYear}`);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border p-2.5 rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors shadow-sm bg-white"
            >
                <span className="font-bold text-sm">{value || 'Select Month/Year'}</span>
                <Calendar size={18} className="text-gray-400" />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-[110] overflow-hidden p-4 animate-in fade-in zoom-in-95 duration-150 origin-top">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <button
                            type="button"
                            onClick={() => setViewYear(viewYear - 1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-black text-lg tracking-tighter uppercase">{viewYear}</span>
                        <button
                            type="button"
                            onClick={() => setViewYear(viewYear + 1)}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {monthNames.map((month) => (
                            <button
                                key={month}
                                type="button"
                                onClick={() => handleMonthSelect(month)}
                                className={`py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${currentMonth === month && initialYear === viewYear
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                        : 'hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-600 dark:text-gray-400 hover:text-blue-600'
                                    }`}
                            >
                                {month.substring(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthYearPicker;
