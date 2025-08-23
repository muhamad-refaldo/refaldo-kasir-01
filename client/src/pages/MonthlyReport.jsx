import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import KpiCard from '../components/KpiCard';
import SalesChart from '../components/SalesChart';
import { 
    ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon, 
    ArrowDownTrayIcon, PaperAirplaneIcon 
} from '@heroicons/react/24/outline';

const MonthlyReport = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reportStatus, setReportStatus] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/reports/monthly?year=${year}&month=${month}`);
                setStats(res.data);
            } catch (error) {
                console.error("Gagal memuat laporan bulanan:", error);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [year, month]);

    const handleDownloadExcel = async () => {
        try {
            const response = await api.get(`/reports/monthly/excel?year=${year}&month=${month}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Laporan-Bulanan-${year}-${month}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Gagal mengunduh laporan Excel bulanan:", error);
            alert("Gagal mengunduh laporan.");
        }
    };

    const handleSendTelegram = async () => {
        setReportStatus('Mengirim laporan bulanan...');
        try {
            const res = await api.post('/reports/monthly/telegram', { year, month });
            setReportStatus(res.data.msg);
        } catch (error) {
            setReportStatus('Gagal mengirim laporan.');
            console.error("Gagal mengirim laporan Telegram bulanan:", error);
        } finally {
            setTimeout(() => setReportStatus(''), 4000);
        }
    };

    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const monthOptions = [
        { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' }, { value: 3, name: 'Maret' },
        { value: 4, name: 'April' }, { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
        { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' }, { value: 9, name: 'September' },
        { value: 10, name: 'Oktober' }, { value: 11, name: 'November' }, { value: 12, name: 'Desember' }
    ];
    
    const selectedMonthName = monthOptions.find(m => m.value == month)?.name || '';

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-4xl font-bold">Laporan Bulanan</h1>
                <div className="flex items-center gap-4">
                    <select className="select select-bordered" value={month} onChange={e => setMonth(e.target.value)}>
                        {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                    </select>
                    <select className="select select-bordered" value={year} onChange={e => setYear(e.target.value)}>
                         {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <button className="btn btn-success" onClick={handleDownloadExcel} disabled={!stats || stats.totalTransactions === 0}>
                        <ArrowDownTrayIcon className="w-6 h-6" /> Excel
                    </button>
                    <button className="btn btn-info" onClick={handleSendTelegram} disabled={!stats || stats.totalTransactions === 0}>
                        <PaperAirplaneIcon className="w-6 h-6" /> Telegram
                    </button>
                </div>
            </div>

            {reportStatus && <p className="text-center text-info">{reportStatus}</p>}

            {loading ? (
                 <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpiCard 
                            title="Total Penjualan Bulan Ini" 
                            // PERBAIKAN DI BARIS INI
                            value={`Rp ${(stats?.totalSales || 0).toLocaleString('id-ID')}`} 
                            icon={<CurrencyDollarIcon className="h-8 w-8" />} 
                        />
                        <KpiCard 
                            title="Total Transaksi Bulan Ini" 
                            value={stats?.totalTransactions || 0} 
                            icon={<ShoppingCartIcon className="h-8 w-8" />} 
                        />
                        <KpiCard 
                            title="Produk Terlaris Bulan Ini" 
                            value={stats?.topProduct || '-'} 
                            icon={<ChartBarIcon className="h-8 w-8" />} 
                        />
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="h-96">
                               <SalesChart 
                                   chartData={stats?.chartData} 
                                   chartTitle={`Grafik Pendapatan Harian - ${selectedMonthName} ${year}`}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MonthlyReport;