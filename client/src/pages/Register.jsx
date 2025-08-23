// client/src/pages/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    // Tambahkan name dan storeName ke state
    const [formData, setFormData] = useState({ name: '', storeName: '', email: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { name, storeName, email, password, password2 } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            return setError('Password tidak cocok');
        }
        setLoading(true);
        setError('');
        try {
            // Kirim semua data baru ke backend
            const res = await api.post('/auth/register', { name, storeName, email, password });
            navigate('/verify-otp', { state: { email: res.data.email } });
        } catch (err) {
            setError(err.response.data.msg || 'Pendaftaran gagal, coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="hero min-h-screen bg-base-200" data-theme="night">
            <div className="card w-full max-w-sm shrink-0 shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={onSubmit}>
                    <h2 className="card-title text-2xl mb-4">Daftar Akun Baru</h2>
                    {error && <div role="alert" className="alert alert-error text-sm">{error}</div>}
                    
                    {/* INPUT NAMA LENGKAP */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Nama Lengkap</span></label>
                        <input type="text" name="name" placeholder="John Doe" className="input input-bordered" required onChange={onChange} />
                    </div>

                    {/* INPUT NAMA TOKO */}
                    <div className="form-control">
                        <label className="label"><span className="label-text">Nama Toko</span></label>
                        <input type="text" name="storeName" placeholder="Toko Sejahtera" className="input input-bordered" required onChange={onChange} />
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Email</span></label>
                        <input type="email" name="email" placeholder="email@anda.com" className="input input-bordered" required onChange={onChange} />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Password</span></label>
                        <input type="password" name="password" placeholder="Minimal 6 karakter" className="input input-bordered" required minLength="6" onChange={onChange} />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Konfirmasi Password</span></label>
                        <input type="password" name="password2" placeholder="Ulangi password" className="input input-bordered" required minLength="6" onChange={onChange} />
                    </div>
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Daftar & Lanjut OTP"}
                        </button>
                    </div>
                    <p className="text-center text-sm mt-4">
                        Sudah punya akun? <Link to="/login" className="link link-primary">Login di sini</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;