import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { 
    ArrowDownTrayIcon, 
    PaperAirplaneIcon, 
    BanknotesIcon, 
    QrCodeIcon, 
    ShoppingBagIcon, 
    BuildingStorefrontIcon,
    XMarkIcon,
    CalendarDaysIcon,
    ReceiptPercentIcon,
    ClockIcon,
    TagIcon
} from '@heroicons/react/24/outline';

// Komponen Kartu Statistik yang Didesain Ulang
const StatCard = ({ title, value, icon, color = 'cyan' }) => {
    const colorClasses = {
        cyan: 'text-cyan-400',
        violet: 'text-violet-400',
        amber: 'text-amber-400',
        emerald: 'text-emerald-400',
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

const History = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportStatus, setReportStatus] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDate) return;
            setLoading(true);
            try {
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
    
    // [FITUR BARU] Mengelompokkan produk terjual berdasarkan kategori
    const productsSoldByCategory = useMemo(() => {
        if (!transactions || transactions.length === 0) return {};

        const productSummary = {};

        transactions.forEach(trx => {
            trx.items.forEach(item => {
                // Mencari kategori dari produk (jika ada)
                const category = item.category || 'Lainnya';
                if (!productSummary[category]) {
                    productSummary[category] = {};
                }
                if (!productSummary[category][item.name]) {
                    productSummary[category][item.name] = 0;
                }
                productSummary[category][item.name] += item.quantity;
            });
        });

        return productSummary;
    }, [transactions]);


    const handleDownloadExcel = async () => {
        try {
            const response = await api.get(`/reports/excel?date=${selectedDate}`, { responseType: 'blob' });
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
            console.error("Gagal mengirim laporan Telegram:", error);
            setReportStatus('Gagal mengirim laporan.');
        } finally {
            setTimeout(() => setReportStatus(''), 3000);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-900 min-h-full">
            {/* Header dan Kontrol */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Riwayat & Laporan</h1>
                    <p className="text-md text-slate-400 mt-1">Tinjau semua transaksi dan ringkasan harian.</p>
                </div>
                <div className="relative">
                    <CalendarDaysIcon className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 w-5 h-5"/>
                    <input 
                        type="date" 
                        className="bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Ringkasan Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Transaksi" value={summary?.totalTransactions || 0} icon={<BuildingStorefrontIcon />} color="cyan" />
                <StatCard title="Pemasukan Tunai" value={`Rp ${(summary?.totalCash || 0).toLocaleString('id-ID')}`} icon={<BanknotesIcon />} color="emerald" />
                <StatCard title="Pemasukan QRIS" value={`Rp ${(summary?.totalQris || 0).toLocaleString('id-ID')}`} icon={<QrCodeIcon />} color="violet" />
                <StatCard title="Online Food" value={`Rp ${(summary?.totalOnline || 0).toLocaleString('id-ID')}`} icon={<ShoppingBagIcon />} color="amber" />
            </div>
            
            {/* Total Pemasukan & Aksi */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                    <p className="text-slate-400">Total Pemasukan pada {selectedDate}</p>
                    <p className="text-3xl font-bold text-white">Rp {(summary?.grandTotal || 0).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-action bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20" onClick={handleDownloadExcel} disabled={transactions.length === 0}>
                        <ArrowDownTrayIcon className="w-5 h-5" /> <span>Excel</span>
                    </button>
                    <button className="btn-action bg-sky-500/10 border-sky-500/30 text-sky-400 hover:bg-sky-500/20" onClick={handleSendTelegram} disabled={transactions.length === 0}>
                        <PaperAirplaneIcon className="w-5 h-5" /> <span>Telegram</span>
                    </button>
                </div>
                {reportStatus && <p className="text-center text-sky-400 text-sm">{reportStatus}</p>}
            </div>

            {/* [FITUR BARU] Ringkasan Produk Terjual */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold text-white p-4 border-b border-slate-700">Ringkasan Produk Terjual</h2>
                {loading ? (
                     <div className="text-center p-10"><span className="loading loading-dots loading-lg text-cyan-400"></span></div>
                ) : Object.keys(productsSoldByCategory).length > 0 ? (
                    <div className="p-4 space-y-4">
                        {Object.entries(productsSoldByCategory).map(([category, products]) => (
                            <div key={category}>
                                <div className="flex items-center gap-2 mb-2">
                                    <TagIcon className="w-5 h-5 text-cyan-400"/>
                                    <h3 className="font-semibold text-lg text-cyan-400">{category}</h3>
                                </div>
                                <div className="divide-y divide-slate-700/50 border-l-2 border-slate-700 pl-4 ml-2">
                                    {Object.entries(products).map(([productName, quantity]) => (
                                        <div key={productName} className="flex justify-between items-center py-2">
                                            <span className="text-slate-300">{productName}</span>
                                            <span className="font-bold text-white">{quantity} pcs</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="p-4 text-slate-400 text-center">Belum ada produk yang terjual pada tanggal ini.</p>
                )}
            </div>

            {/* Daftar Transaksi */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold text-white p-4 border-b border-slate-700">Detail Transaksi</h2>
                {loading ? (
                    <div className="text-center p-10"><span className="loading loading-dots loading-lg text-cyan-400"></span></div>
                ) : transactions.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                        {transactions.map(trx => (
                            <div key={trx._id} onClick={() => setSelectedTransaction(trx)} className="p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="p-2 bg-slate-900/50 rounded-full text-cyan-400 flex-shrink-0"><ClockIcon className="w-6 h-6"/></div>
                                    <div className="truncate">
                                        {/* [FITUR BARU] Menampilkan detail item */}
                                        <p className="font-semibold text-white truncate">
                                            {trx.items[0].name} ({trx.items[0].quantity}x)
                                            {trx.items.length > 1 && <span className="text-slate-400"> + {trx.items.length - 1} item lainnya</span>}
                                        </p>
                                        <p className="text-sm text-slate-400">{new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="font-bold text-lg text-white">Rp {trx.totalAmount.toLocaleString('id-ID')}</p>
                                    <span className="text-xs font-medium text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full">{trx.paymentMethod}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10">
                        <ReceiptPercentIcon className="w-16 h-16 mx-auto text-slate-600"/>
                        <h3 className="mt-4 text-xl font-semibold text-white">Tidak Ada Data</h3>
                        <p className="mt-1 text-slate-400">Tidak ada transaksi yang tercatat pada tanggal ini.</p>
                    </div>
                )}
            </div>

            {/* Modal Detail Transaksi */}
            {selectedTransaction && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTransaction(null)}>
                    <div className="relative w-full max-w-md bg-slate-900/80 border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedTransaction(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h3 className="font-bold text-2xl text-white mb-1">Detail Transaksi</h3>
                        <p className="text-sm text-slate-400 mb-4">#{selectedTransaction._id}</p>
                        <div className="space-y-2 border-t border-b border-slate-700 py-4">
                            {selectedTransaction.items.map(item => (
                                <div key={item.productId || item.name} className="flex justify-between items-center text-slate-300">
                                    <span>{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center font-bold text-white pt-4">
                            <span>Total</span>
                            <span>Rp {selectedTransaction.totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                         <div className="text-center mt-4 text-sm text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full w-fit mx-auto">
                            {selectedTransaction.paymentMethod}
                        </div>
                    </div>
                </div>
            )}
             <style>{`
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

export default History;
