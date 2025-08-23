import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email; // Ambil email dari halaman register

    if (!email) {
        // Jika user akses halaman ini langsung, redirect ke register
        navigate('/register');
        return null;
    }

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', { email, otp });
            localStorage.setItem('token', res.data.token);
            // Setelah OTP benar, LANGSUNG arahkan ke Dashboard
            navigate('/');
        }  catch (err) {
            setError(err.response.data.msg || 'OTP salah atau sudah kedaluwarsa.');
            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" data-theme="night">
            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={onSubmit}>
                    <h2 className="card-title text-2xl">Verifikasi Akun Anda</h2>
                    <p className="text-sm mb-4">Kami telah mengirimkan kode OTP ke <strong>{email}</strong>. Silakan periksa email Anda.</p>
                    {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Kode OTP 6 Digit</span></label>
                        <input 
                            type="text" 
                            name="otp"
                            placeholder="123456" 
                            className="input input-bordered text-center tracking-[1em]"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Verifikasi & Masuk"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;