import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setSuccess(res.data.msg);
            // Arahkan ke halaman reset password setelah 2 detik
            setTimeout(() => {
                navigate('/reset-password', { state: { email: res.data.email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Terjadi kesalahan.');
            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" data-theme="night">
            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={onSubmit}>
                    <h2 className="card-title text-2xl mb-2">Lupa Password</h2>
                    <p className="text-sm text-base-content/70 mb-4">Masukkan email Anda untuk menerima kode OTP reset password.</p>
                    {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
                    {success && <div role="alert" className="alert alert-success text-sm">{success}</div>}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" name="email" placeholder="email@anda.com" className="input input-bordered" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Kirim Kode OTP"}
                        </button>
                    </div>
                    <p className="text-center text-sm mt-4">
                        Ingat password Anda? <Link to="/login" className="link link-primary">Kembali ke Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;