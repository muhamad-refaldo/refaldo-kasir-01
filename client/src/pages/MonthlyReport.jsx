import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SalesChart from '../components/SalesChart'; // Pastikan komponen ini ada
import { 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    ShoppingCartIcon, 
    ArrowDownTrayIcon, 
    PaperAirplaneIcon,
    CalendarDaysIcon,
    PresentationChartLineIcon
} from '@heroicons/react/24/outline';

// Komponen Kartu Statistik yang konsisten dengan halaman History
const StatCard = ({ title, value, icon, color = 'cyan' }) => {
    const colorClasses = {
        cyan: 'text-cyan-400',
        violet: 'text-violet-400',
        amber: 'text-amber-400',
    };
    return (
        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-slate-700">
            <div className={`p-3 rounded-full bg-slate-900/50 ${colorClasses[color]}`}>
                {React.cloneElement(icon, { className: "w-6 h-6" })}
            </div>
            <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="text-xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};


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
        // Logika download tidak berubah
        try {
            const response = await api.get(`/reports/monthly/excel?year=${year}&month=${month}`, { responseType: 'blob' });
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
        // Logika kirim telegram tidak berubah
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

    // Opsi untuk dropdown bulan dan tahun
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const monthOptions = [
        { value: 1, name: 'Januari' }, { value: 2, name: 'Februari' }, { value: 3, name: 'Maret' },
        { value: 4, name: 'April' }, { value: 5, name: 'Mei' }, { value: 6, name: 'Juni' },
        { value: 7, name: 'Juli' }, { value: 8, name: 'Agustus' }, { value: 9, name: 'September' },
        { value: 10, name: 'Oktober' }, { value: 11, name: 'November' }, { value: 12, name: 'Desember' }
    ];
    
    const selectedMonthName = monthOptions.find(m => m.value == month)?.name || '';

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-900 min-h-full">
            {/* Header dan Kontrol */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Laporan Bulanan</h1>
                    <p className="text-md text-slate-400 mt-1">Laporan penjualan bulanan.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <select className="select-style" value={month} onChange={e => setMonth(e.target.value)}>
                        {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
                    </select>
                    <select className="select-style" value={year} onChange={e => setYear(e.target.value)}>
                         {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                 <div className="text-center py-20"><span className="loading loading-dots loading-lg text-cyan-400"></span></div>
            ) : stats ? (
                <>
                    {/* Ringkasan Statistik Bulanan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard 
                            title="Total Penjualan" 
                            value={`Rp ${(stats.totalSales || 0).toLocaleString('id-ID')}`} 
                            icon={<CurrencyDollarIcon />} 
                            color="cyan"
                        />
                        <StatCard 
                            title="Total Transaksi" 
                            value={stats.totalTransactions || 0} 
                            icon={<ShoppingCartIcon />} 
                            color="violet"
                        />
                        <StatCard 
                            title="Produk Terlaris" 
                            value={stats.topProduct || '-'} 
                            icon={<ChartBarIcon />} 
                            color="amber"
                        />
                    </div>

                    {/* Aksi Laporan */}
                     <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-300 font-semibold">Ekspor Laporan untuk {selectedMonthName} {year}</p>
                        <div className="flex items-center gap-2">
                            <button className="btn-action bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" onClick={handleDownloadExcel} disabled={!stats || stats.totalTransactions === 0}>
                                <ArrowDownTrayIcon className="w-5 h-5" /> <span>Excel</span>
                            </button>
                            <button className="btn-action bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20" onClick={handleSendTelegram} disabled={!stats || stats.totalTransactions === 0}>
                                <PaperAirplaneIcon className="w-5 h-5" /> <span>Telegram</span>
                            </button>
                        </div>
                        {reportStatus && <p className="text-center text-sky-400 text-sm w-full sm:w-auto">{reportStatus}</p>}
                    </div>

                    {/* Grafik Penjualan */}
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-4 sm:p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Grafik Pendapatan Harian - {selectedMonthName} {year}</h2>
                        <div className="h-96">
                           <SalesChart chartData={stats.chartData} />
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center p-20 bg-slate-800 rounded-2xl">
                    <PresentationChartLineIcon className="w-16 h-16 mx-auto text-slate-600"/>
                    <h3 className="mt-4 text-xl font-semibold text-white">Data Tidak Ditemukan</h3>
                    <p className="mt-1 text-slate-400">Tidak ada data laporan untuk bulan dan tahun yang dipilih.</p>
                </div>
            )}
            <style>{`
                .select-style {
                    background-color: #1e293b; /* bg-slate-800 */
                    border: 1px solid #334155; /* border-slate-700 */
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 0.75rem 1rem;
                    color: white;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                    background-position: right 0.5rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em 1.5em;
                    padding-right: 2.5rem;
                }
                .select-style:focus {
                    outline: none;
                    border-color: #06b6d4; /* border-cyan-500 */
                    box-shadow: 0 0 0 2px #06b6d4;
                }
                .btn-action {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    border: 1px solid;
                    transition: background-color 0.2s;
                }
                .btn-action:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default MonthlyReport;
