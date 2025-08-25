// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import SalesChart from '../components/SalesChart';
import { 
    ArchiveBoxIcon, 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    ShoppingCartIcon,
    PlusCircleIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fungsi untuk mendapatkan sapaan dinamis berdasarkan waktu
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, storeRes, statsRes] = await Promise.all([
                    api.get('/auth'),
                    api.get('/stores'),
                    api.get('/dashboard/stats')
                ]);
                
                setUser(userRes.data);
                setStore(storeRes.data);
                setStats(statsRes.data);

                if (!userRes.data.storeId) {
                    navigate('/onboarding');
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                }
                console.error("Gagal memuat data dashboard:", error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900">
                <div className="text-center">
                    <span className="loading loading-dots loading-lg text-cyan-400"></span>
                    <p className="text-slate-400 mt-2">Memuat data anjungan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-8 bg-slate-900 min-h-full">
            {/* Header */}
            <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {getGreeting()}, {user?.name.split(' ')[0]}!
                </h1>
                <p className="text-md text-slate-400 mt-1">
                    Selamat datang kembali {store?.name}, mulai transaksi apa hari ini
                </p>
            </div>

            {/* Aksi Cepat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                    onClick={() => navigate('cashier')}
                    className="group flex items-center justify-between p-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <ShoppingCartIcon className="h-6 w-6 text-cyan-400"/>
                        <span className="font-semibold text-white">Buka Halaman Kasir</span>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-cyan-400 transform group-hover:translate-x-1 transition-transform"/>
                </button>
                <button 
                    onClick={() => navigate('products')}
                    className="group flex items-center justify-between p-4 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded-lg transition-all duration-300">
                    <div className="flex items-center space-x-3">
                        <PlusCircleIcon className="h-6 w-6 text-violet-400"/>
                        <span className="font-semibold text-white">Tambah Produk Baru</span>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-violet-400 transform group-hover:translate-x-1 transition-transform"/>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    title="Penjualan Hari Ini" 
                    value={`Rp ${stats?.todaySales.toLocaleString('id-ID') || 0}`} 
                    icon={<CurrencyDollarIcon />}
                    color="cyan"
                />
                <KpiCard 
                    title="Transaksi Hari Ini" 
                    value={stats?.todayTransactions || 0} 
                    icon={<ShoppingCartIcon />} 
                    color="violet"
                />
                <KpiCard 
                    title="Produk Terlaris" 
                    value={stats?.topProduct || '-'} 
                    icon={<ChartBarIcon />} 
                    color="amber"
                />
                <KpiCard 
                    title="Total Produk" 
                    value={stats?.totalProducts || 0} 
                    icon={<ArchiveBoxIcon />} 
                    color="emerald"
                />
            </div>

            {/* Sales Chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Grafik Pendapatan 7 Hari Terakhir</h2>
                <div className="h-80 sm:h-96">
                   <SalesChart chartData={stats?.chartData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
