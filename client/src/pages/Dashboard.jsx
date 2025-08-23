import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import SalesChart from '../components/SalesChart';
import { ArchiveBoxIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil semua data dalam satu waktu untuk efisiensi
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
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* JUDUL DAN SAPAAN BARU SESUAI PERMINTAAN ANDA */}
            <h1 className="text-4xl font-bold">Dashboard Toko {store?.name}</h1>
            <p className="text-lg text-base-content/80">
                Halo bro {user?.name}, mari catat transaksimu ya di {store?.name}, semoga website ini membantu! hehe
            </p>
            <div className="divider"></div>

            {/* KPI Cards dengan data dinamis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard 
                    title="Penjualan Hari Ini" 
                    value={`Rp ${stats?.todaySales.toLocaleString('id-ID') || 0}`} 
                    icon={<CurrencyDollarIcon className="h-8 w-8" />} 
                />
                <KpiCard 
                    title="Transaksi Hari Ini" 
                    value={stats?.todayTransactions || 0} 
                    icon={<ShoppingCartIcon className="h-8 w-8" />} 
                />
                <KpiCard 
                    title="Produk Terlaris Hari Ini" 
                    value={stats?.topProduct || '-'} 
                    icon={<ChartBarIcon className="h-8 w-8" />} 
                />
                <KpiCard 
                    title="Total Produk" 
                    value={stats?.totalProducts || 0} 
                    icon={<ArchiveBoxIcon className="h-8 w-8" />} 
                />
            </div>

            {/* Sales Chart dengan data dinamis */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="h-96">
                       <SalesChart chartData={stats?.chartData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;