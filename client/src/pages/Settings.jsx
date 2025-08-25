import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BuildingStorefrontIcon, BellAlertIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Settings = () => {
    const [formData, setFormData] = useState({ name: '', telegramBotToken: '', telegramChatId: '' });
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const res = await api.get('/stores');
                setFormData({
                    name: res.data.name || '',
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
        setIsSaving(true);
        setSuccessMessage('');
        try {
            const res = await api.put('/stores', formData);
            setSuccessMessage(res.data.msg || 'Pengaturan berhasil disimpan!');
            // Hapus pesan sukses setelah beberapa detik
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (error) {
            console.error("Gagal menyimpan pengaturan:", error);
            // Di sini Anda bisa menambahkan state untuk pesan error jika diperlukan
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="text-center">
                    <span className="loading loading-dots loading-lg text-cyan-400"></span>
                    <p className="text-slate-400 mt-2">Memuat data pengaturan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-900 min-h-full">
            {/* Header Halaman */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Pengaturan</h1>
                <p className="text-md text-slate-400 mt-1">Kelola informasi toko dan integrasi notifikasi Anda.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6 max-w-4xl mx-auto">
                {/* Kartu Pengaturan Toko */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-slate-700 flex items-center gap-4">
                        <BuildingStorefrontIcon className="w-8 h-8 text-cyan-400"/>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Informasi Toko</h2>
                            <p className="text-sm text-slate-400">Ubah nama toko yang akan ditampilkan di seluruh aplikasi.</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nama Toko</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={onChange} 
                            className="input-field-style" 
                            required 
                        />
                    </div>
                </div>

                {/* Kartu Pengaturan Telegram */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
                    <div className="p-6 border-b border-slate-700 flex items-center gap-4">
                        <BellAlertIcon className="w-8 h-8 text-cyan-400"/>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Notifikasi Telegram</h2>
                            <p className="text-sm text-slate-400">Dapatkan laporan penjualan harian langsung ke akun Telegram Anda.</p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Token Bot Telegram</label>
                            <input 
                                type="text" 
                                name="telegramBotToken" 
                                value={formData.telegramBotToken} 
                                onChange={onChange} 
                                placeholder="Contoh: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" 
                                className="input-field-style" 
                            />
                             <p className="text-xs text-slate-500 mt-1">Dapatkan dari @BotFather di Telegram.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Chat ID Telegram</label>
                            <input 
                                type="text" 
                                name="telegramChatId" 
                                value={formData.telegramChatId} 
                                onChange={onChange} 
                                placeholder="Contoh: -1001234567890 (Grup) atau 123456789 (Pribadi)" 
                                className="input-field-style" 
                            />
                             <p className="text-xs text-slate-500 mt-1">Dapatkan dari @userinfobot atau @myidbot.</p>
                        </div>
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-end items-center gap-4 pt-4">
                    {successMessage && (
                        <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircleIcon className="w-5 h-5"/>
                            <span>{successMessage}</span>
                        </div>
                    )}
                    <button 
                        type="submit" 
                        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Menyimpan...</span>
                            </>
                        ) : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
            <style>{`
                .input-field-style {
                    width: 100%;
                    background-color: rgba(30, 41, 59, 0.5); /* bg-slate-800/50 */
                    border: 1px solid #475569; /* border-slate-700 */
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 0.75rem 1rem;
                    color: white;
                    transition: all 0.3s;
                }
                .input-field-style::placeholder {
                    color: #64748b; /* placeholder-slate-500 */
                }
                .input-field-style:focus {
                    outline: none;
                    --tw-ring-shadow: 0 0 0 2px #06b6d4; /* ring-2 ring-cyan-500 */
                    box-shadow: var(--tw-ring-shadow);
                    border-color: #06b6d4; /* border-cyan-500 */
                }
            `}</style>
        </div>
    );
};

export default Settings;
