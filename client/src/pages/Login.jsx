import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Import ikon dari react-icons
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FaRocket } from 'react-icons/fa';
// --- [TAMBAHAN] Impor ikon mata ---
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';


// Komponen untuk efek bintang bergerak
const AnimatedStars = () => (
    <div className="stars">
        <div className="stars-bg"></div>
    </div>
);

// Komponen untuk efek kilau pada form
const FormShine = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
        <div className="absolute top-0 -left-1/2 w-full h-full bg-white/20 transform -skew-x-12 mix-blend-overlay animate-[shine_5s_ease-in-out_infinite]"></div>
        <style>{`
            @keyframes shine {
                0% { transform: translateX(-100%) skewX(-12deg); }
                30%, 100% { transform: translateX(250%) skewX(-12deg); }
            }
        `}</style>
    </div>
);


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    // --- [TAMBAHAN] State untuk visibilitas password ---
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Simulasi loading agar efeknya terlihat
            await new Promise(resolve => setTimeout(resolve, 1500));
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Kredensial tidak valid. Periksa kembali sinyal transmisi Anda.');
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#02041a] flex items-center justify-center p-4 overflow-hidden">
            <AnimatedStars />
            
            <div className="relative z-10 w-full max-w-md">
                <div className="relative bg-slate-900/50 backdrop-blur-md border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10">
                    <FormShine />
                    
                    <form className="relative p-6 sm:p-10" onSubmit={onSubmit}>
                        {/* Header Form */}
                        <div className="text-center mb-8">
                            <FaRocket className="mx-auto text-5xl text-cyan-400 mb-4 animate-pulse" />
                            <h1 className="text-3xl font-bold text-white tracking-wider font-mono">
                                Login
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm">
                                Masukan email dan password anda
                            </p>
                        </div>

                        {/* Tampilan Error */}
                        {error && (
                            <div role="alert" className="mb-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        {/* Input Email */}
                        <div className="relative mb-6">
                            <HiOutlineMail className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-xl pointer-events-none" />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="aldo@gmail.com" 
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300" 
                                value={email} 
                                onChange={onChange} 
                                required 
                            />
                        </div>

                        {/* --- [PERUBAHAN] Input Password dengan Ikon Mata --- */}
                        <div className="relative mb-4">
                            <HiOutlineLockClosed className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 text-xl pointer-events-none" />
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name="password" 
                                placeholder="password" 
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-12 pr-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"
                                value={password} 
                                onChange={onChange} 
                                required 
                            />
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer text-slate-400 hover:text-cyan-400 transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                            </div>
                        </div>
                        
                        <div className="text-right mb-6">
                            <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">Lupa password</Link>
                        </div>
                        
                        {/* Tombol Login */}
                        <div className="form-control">
                            <button 
                                type="submit" 
                                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : "Login"}
                            </button>
                        </div>

                        {/* Link ke Register */}
                        <p className="text-center text-sm text-slate-400 mt-8">
                            <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">daftar</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
