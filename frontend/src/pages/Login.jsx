import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Phone, TrendingUp, AlertCircle, Check } from 'lucide-react';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' or 'recovery'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Remember Me logic
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (mode === 'login') {
            const res = await login(email, password);
            if (res.success) {
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                navigate('/');
            } else {
                setError("❗ Error message not notifiedly accuired");
            }
        } else {
            // Recovery flow
            try {
                await axios.post('http://localhost:5000/api/auth/verify-reset', {
                    email,
                    phone,
                    newPassword
                });
                alert('Password reset successful! Please login with your new password.');
                setMode('login');
                setPassword('');
                setError(null);
            } catch (err) {
                setError("❗ Error message not notifiedly accuired");
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-950 overflow-hidden font-sans">
            {/* Background Animation / Network Map */}
            <div className="absolute inset-0 z-0">
                <svg className="h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <g className="animate-pulse">
                        <circle cx="10%" cy="20%" r="2" fill="#06b6d4" />
                        <circle cx="90%" cy="10%" r="2" fill="#3b82f6" />
                        <circle cx="85%" cy="80%" r="2" fill="#06b6d4" />
                        <circle cx="15%" cy="85%" r="2" fill="#3b82f6" />
                        <circle cx="50%" cy="50%" r="3" fill="#06b6d4" className="animate-ping" />
                        <line x1="10%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="0.5" />
                        <line x1="90%" y1="10%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="0.5" />
                        <line x1="85%" y1="80%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="0.5" />
                        <line x1="15%" y1="85%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="0.5" />
                    </g>
                    {/* Stylized Node Clusters */}
                    {[...Array(5)].map((_, i) => (
                        <rect
                            key={i}
                            x={`${20 + i * 15}%`}
                            y={`${15 + (i % 3) * 20}%`}
                            width="40"
                            height="20"
                            className="fill-cyan-500/10 stroke-cyan-500/20"
                            rx="4"
                        >
                            <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${3 + i}s`} repeatCount="indefinite" />
                        </rect>
                    ))}
                </svg>
            </div>

            {/* Top Left Branding */}
            <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
                <div className="p-2 bg-cyan-500/20 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    <TrendingUp className="text-cyan-400" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Portal</span>
            </div>

            {/* Central Glassmorphism Card */}
            <div className="relative z-10 w-full max-w-lg mx-4">
                <div className="backdrop-blur-xl bg-white/5 p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/20">
                    {/* Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur opacity-30 -z-10 group-hover:opacity-100 transition duration-1000"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-cyan-400 tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                            Salary Portal Login
                        </h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Alert Bar */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-600 text-white p-4 rounded-xl shadow-lg animate-bounce-short">
                                <AlertCircle size={20} className="shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${email ? 'top-2 text-[10px] text-cyan-400 uppercase tracking-widest font-bold' : 'top-1/2 -translate-y-1/2 text-gray-400'}`}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 pt-6 pb-2 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 shadow-inner transition-all"
                                />
                            </div>

                            {mode === 'login' ? (
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                    <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${password ? 'top-2 text-[10px] text-cyan-400 uppercase tracking-widest font-bold' : 'top-1/2 -translate-y-1/2 text-gray-400'}`}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 pt-6 pb-2 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 shadow-inner transition-all"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                        <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${phone ? 'top-2 text-[10px] text-cyan-400 uppercase tracking-widest font-bold' : 'top-1/2 -translate-y-1/2 text-gray-400'}`}>
                                            Registered Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-12 pr-4 pt-6 pb-2 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 shadow-inner transition-all"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                        <label className={`absolute left-12 transition-all duration-200 pointer-events-none ${newPassword ? 'top-2 text-[10px] text-cyan-400 uppercase tracking-widest font-bold' : 'top-1/2 -translate-y-1/2 text-gray-400'}`}>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 pt-6 pb-2 bg-black/40 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-cyan-500/50 shadow-inner transition-all"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {mode === 'login' && (
                            <div className="flex items-center justify-between px-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-5 h-5 border-2 border-white/20 rounded-md bg-white/5 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all"></div>
                                        {rememberMe && <Check size={12} className="absolute inset-0 m-auto text-white font-bold" />}
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">Remember Me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => { setMode('recovery'); setError(null); }}
                                    className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 hover:underline decoration-cyan-400/30 underline-offset-4 transition-all"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${mode === 'login'
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40'
                                }`}
                        >
                            {mode === 'login' ? 'Sign In' : 'Reset Password'}
                        </button>

                        {mode === 'recovery' && (
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(null); }}
                                className="w-full text-center text-sm font-bold text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                Back to Sign In
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-short {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-short {
                    animation: bounce-short 0.5s ease-in-out infinite;
                }
            ` }} />
        </div>
    );
};

export default Login;
