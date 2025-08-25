import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

// Komponen latar belakang tata surya yang sama
const SolarSystemBackground = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 w-px h-px bg-yellow-400 rounded-full shadow-[0_0_150px_70px_#fde047,0_0_50px_30px_#facc15,0_0_20px_10px_#fff]"></div>
        <div className="planet-orbit" style={{ width: '350px', height: '350px', animationDuration: '20s' }}>
            <div className="planet bg-sky-400" style={{ width: '12px', height: '12px' }}></div>
        </div>
        <div className="planet-orbit" style={{ width: '550px', height: '550px', animationDuration: '35s' }}>
            <div className="planet bg-red-500" style={{ width: '10px', height: '10px' }}></div>
        </div>
        <style>{`
            @keyframes orbit {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .planet-orbit {
                position: absolute;
                top: 50%;
                left: 50%;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                animation: orbit linear infinite;
            }
            .planet {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
        `}</style>
    </div>
);

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Ambil data lengkap dari state navigasi
    const { totalAmount, paymentMethod, items } = location.state || { totalAmount: 0, paymentMethod: 'Tidak Diketahui', items: [] };

    // State untuk countdown
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Redirect jika tidak ada data transaksi (akses langsung)
        if (!location.state) {
            navigate('/cashier');
            return;
        }

        // Timer untuk countdown dan redirect otomatis
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/cashier');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer
    }, [navigate, location.state]);

    return (
        <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
            <SolarSystemBackground />
            <div className="relative z-10 w-full max-w-lg text-center">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl shadow-green-500/10 p-8">
                    <CheckBadgeIcon className="w-24 h-24 text-green-400 mx-auto animate-pulse" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4">Transaksi Berhasil!</h1>
                    <p className="py-4 text-lg text-slate-300">
                        Pembayaran via <strong>{paymentMethod}</strong> sejumlah 
                        <strong className="text-green-400 text-xl block mt-2">Rp {totalAmount.toLocaleString('id-ID')}</strong> 
                        telah berhasil diterima.
                    </p>
                    
                    {/* Detail Item yang Dibeli */}
                    <div className="text-left bg-slate-800/50 p-4 rounded-lg max-h-40 overflow-y-auto border border-slate-700 my-4">
                        <h3 className="font-semibold text-white mb-2">Rincian Pesanan:</h3>
                        <ul className="space-y-1 text-sm">
                            {items.map((item, index) => (
                                <li key={index} className="flex justify-between text-slate-400">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tombol & Countdown */}
                    <button 
                        onClick={() => navigate('/cashier')}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Buat Transaksi Baru
                    </button>
                    <p className="text-slate-500 text-sm mt-4">
                        Kembali otomatis dalam {countdown} detik...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Success;
