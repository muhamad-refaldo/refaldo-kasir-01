import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

// Ikon-ikon yang akan kita gunakan
import { HiOutlineShieldCheck } from 'react-icons/hi';

// Komponen latar belakang bintang yang sama
const AnimatedStars = () => (
    <div className="stars">
        <div className="stars-bg"></div>
    </div>
);

// Komponen efek kilau yang sama
const FormShine = () => (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
        <div className="absolute top-0 -left-1/2 w-full h-full bg-white/20 transform -skew-x-12 mix-blend-overlay animate-[shine_5s_ease_in_out_infinite]"></div>
    </div>
);

const VerifyOtp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // --- [FITUR BARU] State untuk countdown timer ---
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const inputRefs = useRef([]);

    // Redirect jika user mengakses halaman ini tanpa email
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // --- [FITUR BARU] Logika untuk countdown timer ---
    useEffect(() => {
        // Jika countdown selesai, aktifkan tombol dan hentikan timer
        if (countdown <= 0) {
            setIsResendDisabled(false);
            return;
        }

        // Kurangi countdown setiap 1 detik
        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        // Bersihkan timer saat komponen di-unmount atau countdown berubah
        return () => clearTimeout(timer);
    }, [countdown]);


    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (isNaN(value) || value.length !== 6) return;
        setOtp(value.split(""));
        inputRefs.current[5].focus();
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const finalOtp = otp.join("");

        if (finalOtp.length !== 6) {
            setError('Kode OTP harus 6 digit.');
            setLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/verify-otp', { email, otp: finalOtp });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        }  catch (err) {
            setError(err.response?.data?.msg || 'OTP salah atau sudah kedaluwarsa.');
            setLoading(false);
        }
    };
    
    // --- [FITUR BARU] Logika kirim ulang dengan reset timer ---
    const handleResendOtp = async () => {
        setIsResendDisabled(true); // Langsung nonaktifkan tombol
        setError('');
        try {
            await api.post('/auth/resend-otp', { email });
            setCountdown(60); // Reset timer ke 60 detik setelah berhasil
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal mengirim ulang OTP.');
            setIsResendDisabled(false); // Aktifkan lagi jika gagal
        }
    };

    if (!email) return null;

    return (
        <div className="relative min-h-screen w-full bg-[#02041a] flex items-center justify-center p-4 overflow-hidden">
            <AnimatedStars />
            
            <div className="relative z-10 w-full max-w-md">
                <div className="relative bg-slate-900/50 backdrop-blur-md border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10">
                    <FormShine />
                    
                    <form className="relative p-6 sm:p-10" onSubmit={onSubmit}>
                        <div className="text-center mb-8">
                            <HiOutlineShieldCheck className="mx-auto text-5xl text-cyan-400 mb-4 animate-pulse" />
                            <h1 className="text-3xl font-bold text-white tracking-wider font-mono">
                                Dekripsi Sinyal
                            </h1>
                            <p className="text-slate-400 mt-2 text-sm">
                                Kode transmisi telah dikirim ke: <br/>
                                <strong className="text-cyan-300 break-all">{email}</strong>
                            </p>
                        </div>

                        {error && (
                            <div role="alert" className="mb-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center space-x-2 sm:space-x-3 mb-8" onPaste={handlePaste}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name="otp"
                                    maxLength="1"
                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-bold text-white bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"
                                    value={data}
                                    onChange={e => handleChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                    onKeyDown={e => handleKeyDown(e, index)}
                                    ref={el => (inputRefs.current[index] = el)}
                                />
                            ))}
                        </div>
                        
                        <div className="form-control">
                            <button 
                                type="submit" 
                                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? ( <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> <span>Memverifikasi...</span> </> ) : "Verifikasi & Aktifkan"}
                            </button>
                        </div>

                        {/* --- [FITUR BARU] Tombol Kirim Ulang dengan Countdown --- */}
                        <div className="text-center text-sm text-slate-400 mt-8">
                            Tidak menerima sinyal? 
                            <button 
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isResendDisabled}
                                className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1 disabled:text-slate-500 disabled:cursor-not-allowed disabled:no-underline"
                            >
                                {isResendDisabled ? `Kirim Ulang dalam ${countdown} detik` : 'Kirim Ulang'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
