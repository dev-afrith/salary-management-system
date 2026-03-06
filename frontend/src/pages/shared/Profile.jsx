import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Briefcase, Calendar, Phone, Cake, MapPin, Hash } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const endpoint = user.role === 'admin' ? 'http://localhost:5000/api/admin/profile' : 'http://localhost:5000/api/employee/profile';
                const res = await axios.get(endpoint);
                setProfileData(res.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error.response?.data?.message || 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.role]);

    const [error, setError] = useState(null);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                <span className="font-bold tracking-tighter uppercase text-xs bg-red-600 text-white px-2 py-1 rounded">Error</span>
                <p className="text-sm font-medium">{error || 'Error loading profile data. Please try again later.'}</p>
            </div>
        );
    }

    const isAdmin = user.role === 'admin';

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12">
                        <div className="p-1 bg-white dark:bg-gray-800 rounded-2xl">
                            <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-blue-600">
                                <User size={48} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {isAdmin ? 'System Administrator' : `${profileData.first_name} ${profileData.last_name}`}
                            </h1>
                            <p className="text-gray-500 font-medium">
                                {isAdmin ? 'Full System Access' : `${profileData.designation} • ${profileData.department}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isAdmin
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                                }`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            Details & Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <InfoItem
                                icon={<Mail size={18} />}
                                label="Email Address"
                                value={profileData.email}
                            />
                            {!isAdmin && (
                                <>
                                    <InfoItem
                                        icon={<Phone size={18} />}
                                        label="Mobile Number"
                                        value={profileData.contact_number}
                                    />
                                    <InfoItem
                                        icon={<Cake size={18} />}
                                        label="Birth Date"
                                        value={profileData.birthdate ? new Date(new Date(profileData.birthdate).getTime() - (new Date(profileData.birthdate).getTimezoneOffset() * 60000)).toLocaleDateString() : 'Not provided'}
                                    />
                                    <InfoItem
                                        icon={<Hash size={18} />}
                                        label="Age"
                                        value={profileData.birthdate ? `${new Date().getFullYear() - new Date(profileData.birthdate).getFullYear()} Years` : 'Age N/A'}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {!isAdmin && (
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                Employment Details
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <InfoItem
                                    icon={<Hash size={18} />}
                                    label="Employee ID"
                                    value={`EMP-${profileData.id.toString().padStart(4, '0')}`}
                                />
                                <InfoItem
                                    icon={<Calendar size={18} />}
                                    label="Joined Date"
                                    value={profileData.joined_date ? new Date(new Date(profileData.joined_date).getTime() - (new Date(profileData.joined_date).getTimezoneOffset() * 60000)).toLocaleDateString() : 'Not provided'}
                                />
                                <InfoItem
                                    icon={<Briefcase size={18} />}
                                    label="Department"
                                    value={profileData.department}
                                />
                                <InfoItem
                                    icon={<Shield size={18} />}
                                    label="Designation"
                                    value={profileData.designation}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                            Account Status
                        </h2>
                        <div className="space-y-4">
                            <StatusItem label="Account Type" value={user.role} active />
                            <StatusItem label="Language" value="English (US)" />
                            <StatusItem label="Timezone" value="UTC+5:30" />
                        </div>
                    </div>

                    <div className="bg-blue-600 p-8 rounded-2xl shadow-lg text-white">
                        <h3 className="font-black uppercase tracking-tighter text-xl mb-2">Need Help?</h3>
                        <p className="text-blue-100 text-sm mb-4 leading-relaxed">Contact the HR department if any information is incorrect or needs updating.</p>
                        <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-colors">
                            Support Desk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{value || 'Not provided'}</p>
        </div>
    </div>
);

const StatusItem = ({ label, value, active }) => (
    <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</span>
        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`}>
            {value}
        </span>
    </div>
);

export default Profile;
