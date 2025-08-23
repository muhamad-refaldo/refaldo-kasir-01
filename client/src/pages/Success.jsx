import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalAmount, paymentMethod } = location.state || { totalAmount: 0, paymentMethod: 'Tidak diketahui' };

    useEffect(() => {
        // Kembali ke kasir setelah 3 detik
        const timer = setTimeout(() => {
            navigate('/cashier');
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer
    }, [navigate]);

    return (
        <div className="hero min-h-screen bg-base-200" data-theme="night">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="text-9xl">✅</div>
                    <h1 className="text-5xl font-bold mt-4">Transaksi Berhasil!</h1>
                    <p className="py-6 text-2xl">
                        Pembayaran via <strong>{paymentMethod}</strong> sejumlah <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong> telah berhasil.
                    </p>
                    <p className="animate-pulse">Anda akan diarahkan kembali ke kasir...</p>
                </div>
            </div>
        </div>
    );
};

export default Success;