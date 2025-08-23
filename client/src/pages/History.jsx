import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
    ArrowDownTrayIcon, 
    PaperAirplaneIcon, 
    BanknotesIcon, 
    QrCodeIcon, 
    ShoppingBagIcon, 
    BuildingStorefrontIcon 
} from '@heroicons/react/24/outline';

// Komponen kecil untuk menampilkan kartu statistik
const StatCard = ({ title, value, icon }) => (
    <div className="stat bg-base-100 shadow">
        <div className="stat-figure text-primary">{icon}</div>
        <div className="stat-title">{title}</div>
        <div className="stat-value text-lg">Rp {value.toLocaleString('id-ID')}</div>
    </div>
);

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null); // State baru untuk statistik
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportStatus, setReportStatus] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDate) return;
            setLoading(true);
            try {
                // Panggil kedua API (transaksi dan ringkasan) secara bersamaan
                const [trxRes, summaryRes] = await Promise.all([
                    api.get(`/transactions?date=${selectedDate}`),
                    api.get(`/history/summary?date=${selectedDate}`)
                ]);
                setTransactions(trxRes.data);
                setSummary(summaryRes.data);
            } catch (error) {
                console.error("Gagal memuat data riwayat:", error);
                setTransactions([]);
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const handleDownloadExcel = async () => {
        try {
            const response = await api.get(`/reports/excel?date=${selectedDate}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan-Penjualan-${selectedDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Gagal mengunduh laporan Excel:", error);
            alert("Gagal mengunduh laporan.");
        }
    };

    const handleSendTelegram = async () => {
        setReportStatus('Mengirim laporan...');
        try {
            const res = await api.post('/reports/telegram', { date: selectedDate });
            setReportStatus(res.data.msg);
        } catch (error) {
            setReportStatus('Gagal mengirim laporan.');
            console.error("Gagal mengirim laporan Telegram:", error);
        } finally {
            setTimeout(() => setReportStatus(''), 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Bagian Kontrol Atas */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-4xl font-bold">Riwayat Transaksi</h1>
                <div className="flex items-center gap-4">
                    <input 
                        type="date" 
                        className="input input-bordered"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button className="btn btn-success" onClick={handleDownloadExcel} disabled={transactions.length === 0}>
                        <ArrowDownTrayIcon className="w-6 h-6" /> Excel
                    </button>
                    <button className="btn btn-info" onClick={handleSendTelegram} disabled={transactions.length === 0}>
                        <PaperAirplaneIcon className="w-6 h-6" /> Telegram
                    </button>
                </div>
            </div>
            {reportStatus && <p className="text-center text-info">{reportStatus}</p>}

            {/* BAGIAN BARU: STATISTIK RINGKASAN */}
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div className="stat bg-base-100">
                    <div className="stat-figure text-secondary"><BuildingStorefrontIcon className="w-8 h-8"/></div>
                    <div className="stat-title">Jumlah Transaksi</div>
                    <div className="stat-value">{summary?.totalTransactions || 0}</div>
                </div>
                <StatCard title="Pemasukan Tunai" value={summary?.totalCash || 0} icon={<BanknotesIcon className="w-8 h-8"/>} />
                <StatCard title="Pemasukan QRIS" value={summary?.totalQris || 0} icon={<QrCodeIcon className="w-8 h-8"/>} />
                <StatCard title="Pemasukan Online Food" value={summary?.totalOnline || 0} icon={<ShoppingBagIcon className="w-8 h-8"/>} />
                <div className="stat bg-base-100">
                    <div className="stat-figure text-accent"><BanknotesIcon className="w-8 h-8"/></div>
                    <div className="stat-title">Total Pemasukan</div>
                    <div className="stat-value text-accent">Rp {(summary?.grandTotal || 0).toLocaleString('id-ID')}</div>
                </div>
            </div>

            {/* Tabel Transaksi */}
            <div className="overflow-x-auto card bg-base-100 shadow-xl">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Waktu</th>
                            <th>Item</th>
                            <th>Total</th>
                            <th>Metode Bayar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center"><span className="loading loading-spinner"></span></td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map(trx => (
                                <tr key={trx._id}>
                                    <td>{new Date(trx.createdAt).toLocaleTimeString('id-ID')}</td>
                                    <td>
                                        {trx.items.map(item => (
                                            <div key={item.productId}>{item.name} ({item.quantity}x)</div>
                                        ))}
                                    </td>
                                    <td>Rp {trx.totalAmount.toLocaleString('id-ID')}</td>
                                    <td><div className="badge badge-outline">{trx.paymentMethod}</div></td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="text-center">Tidak ada transaksi pada tanggal ini.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;