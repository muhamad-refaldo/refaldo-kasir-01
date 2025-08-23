import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Onboarding = () => {
    const [formData, setFormData] = useState({ name: '', telegramBotToken: '', telegramChatId: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/stores', formData);            // Server akan memberikan token baru yang berisi storeId
            localStorage.setItem('token', res.data.token);
            navigate('/'); // Arahkan ke dashboard utama
        } catch (err) {
            setError(err.response.data.msg || 'Gagal membuat toko, coba lagi.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Langkah Terakhir!</h1>
            <p className="mb-6">Buat toko Anda untuk memulai. Anda bisa mengatur notifikasi Telegram di sini.</p>
            
            <div className="card bg-base-100 shadow-xl">
                <form className="card-body" onSubmit={onSubmit}>
                    {error && <div role="alert" className="alert alert-error text-sm mb-4">{error}</div>}
                    
                    <div className="form-control">
                        <label className="label"><span className="label-text">Nama Toko Anda</span></label>
                        <input type="text" name="name" placeholder="Contoh: Martabak Jaya" className="input input-bordered" required onChange={onChange} />
                    </div>

                    <div className="divider">Pengaturan Notifikasi Telegram (Opsional)</div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Token Bot Telegram</span>
                            <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="label-text-alt link link-info">Dapatkan dari BotFather</a>
                        </label>
                        <input type="text" name="telegramBotToken" placeholder="Contoh: 123456:ABC-DEF1234..." className="input input-bordered" onChange={onChange} />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Chat ID Telegram</span>
                             <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="label-text-alt link link-info">Dapatkan dari UserInfoBot</a>
                        </label>
                        <input type="text" name="telegramChatId" placeholder="ID grup atau pribadi Anda" className="input input-bordered" onChange={onChange} />
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                             {loading ? <span className="loading loading-spinner"></span> : "Buat Toko & Masuk Dashboard"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;