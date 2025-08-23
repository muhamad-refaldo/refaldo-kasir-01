import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
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
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login gagal, periksa kembali email dan password Anda.');
            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" data-theme="night">
            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={onSubmit}>
                    <h2 className="card-title text-2xl mb-4">Selamat Datang!</h2>
                    {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" name="email" placeholder="email@anda.com" className="input input-bordered" value={email} onChange={onChange} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                            {/* LINK LUPA PASSWORD DITAMBAHKAN DI SINI */}
                            <Link to="/forgot-password" className="label-text-alt link link-hover link-primary">Lupa password?</Link>
                        </label>
                        <input type="password" name="password" placeholder="••••••••" className="input input-bordered" value={password} onChange={onChange} required />
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Login"}
                        </button>
                    </div>
                    <p className="text-center text-sm mt-4">
                        Belum punya akun? <Link to="/register" className="link link-primary">Daftar di sini</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;