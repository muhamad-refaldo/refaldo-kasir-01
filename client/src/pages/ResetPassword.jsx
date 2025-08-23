import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../utils/api';

const ResetPassword = () => {
    const [formData, setFormData] = useState({ otp: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/forgot-password');
        return null;
    }

    const { otp, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            return setError('Password baru tidak cocok');
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { email, otp, password });
            alert("Password berhasil direset! Silakan login dengan password baru Anda.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.msg || 'Gagal mereset password.');
            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" data-theme="night">
            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={onSubmit}>
                    <h2 className="card-title text-2xl">Reset Password</h2>
                    <p className="text-sm text-base-content/70 mb-4">Cek email Anda untuk kode OTP, lalu masukkan password baru.</p>
                    {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Kode OTP</span></label>
                        <input type="text" name="otp" placeholder="123456" className="input input-bordered" required onChange={onChange} />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Password Baru</span></label>
                        <input type="password" name="password" placeholder="Minimal 6 karakter" className="input input-bordered" required minLength="6" onChange={onChange} />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Konfirmasi Password Baru</span></label>
                        <input type="password" name="password2" placeholder="Ulangi password baru" className="input input-bordered" required minLength="6" onChange={onChange} />
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Simpan Password Baru"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;