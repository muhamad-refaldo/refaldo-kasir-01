import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Settings = () => {
    const [formData, setFormData] = useState({ name: '', telegramBotToken: '', telegramChatId: '' });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await api.get('/stores');
                setFormData({
                    name: res.data.name,
                    telegramBotToken: res.data.telegramBotToken || '',
                    telegramChatId: res.data.telegramChatId || ''
                });
            } catch (error) {
                console.error("Gagal memuat pengaturan toko:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSuccess('');
        try {
            const res = await api.put('/stores', formData);
            setSuccess(res.data.msg);
        } catch (error) {
            console.error("Gagal menyimpan pengaturan:", error);
        }
    };

    if (loading) {
        return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold">Pengaturan Toko</h1>
            <div className="card bg-base-100 shadow-xl max-w-2xl">
                <form className="card-body" onSubmit={onSubmit}>
                    {success && <div role="alert" className="alert alert-success text-sm mb-4">{success}</div>}
                    
                    <div className="form-control">
                        <label className="label"><span className="label-text">Nama Toko</span></label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} className="input input-bordered" required />
                    </div>

                    <div className="divider">Pengaturan Notifikasi Telegram</div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Token Bot Telegram</span></label>
                        <input type="text" name="telegramBotToken" value={formData.telegramBotToken} onChange={onChange} placeholder="Masukkan token dari @BotFather" className="input input-bordered" />
                    </div>
                    
                    <div className="form-control">
                        <label className="label"><span className="label-text">Chat ID Telegram</span></label>
                        <input type="text" name="telegramChatId" value={formData.telegramChatId} onChange={onChange} placeholder="Masukkan ID chat pribadi atau grup" className="input input-bordered" />
                    </div>

                    <div className="card-actions justify-end mt-4">
                        <button type="submit" className="btn btn-primary">Simpan Perubahan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;