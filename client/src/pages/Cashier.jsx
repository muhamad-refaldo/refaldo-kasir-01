import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';

const Cashier = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Untuk mengarahkan ke halaman sukses

    // Memuat data semua produk saat halaman dibuka
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (error) {
                console.error("Gagal memuat produk:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item._id === product._id);
            if (existingItem) {
                return currentCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart(currentCart => {
            return currentCart.map(item =>
                item._id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            ).filter(item => item.quantity > 0);
        });
    };

    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item._id !== productId));
    };

    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    // FUNGSI INI DIUBAH: Sekarang hanya membuka modal
    const handleCheckout = () => {
        if (cart.length === 0) return alert("Keranjang masih kosong!");
        document.getElementById('payment_modal').showModal();
    };

    // FUNGSI BARU: Memproses transaksi setelah metode pembayaran dipilih
    const processTransaction = async (paymentMethod) => {
        document.getElementById('payment_modal').close();
        
        const transactionData = {
            items: cart.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            totalAmount: totalAmount,
            paymentMethod: paymentMethod, // Menggunakan metode yang dipilih
        };

        try {
            await api.post('/transactions', transactionData);
            setCart([]); // Kosongkan keranjang
            // Arahkan ke halaman sukses dengan membawa data
            navigate('/success', { state: { totalAmount, paymentMethod } });
        } catch (error) {
            console.error("Gagal melakukan checkout:", error);
            alert("Gagal menyimpan transaksi.");
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            {/* Kolom Kiri: Daftar Produk */}
            <div className="lg:col-span-2 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Pilih Produk</h2>
                <input 
                    type="text" 
                    placeholder="Cari produk..." 
                    className="input input-bordered w-full mb-4"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {loading ? <p>Memuat produk...</p> : filteredProducts.map(product => (
                        <div key={product._id} className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={() => addToCart(product)}>
                            <div className="card-body p-4">
                                <h3 className="card-title text-base">{product.name}</h3>
                                <p className="text-primary font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Kolom Kanan: Keranjang & Checkout */}
            <div className="card bg-base-100 shadow-xl flex flex-col">
                <div className="card-body flex-grow overflow-y-auto">
                    <h2 className="card-title text-2xl">Keranjang</h2>
                    <div className="divider my-2"></div>
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center my-auto">Keranjang kosong</p>
                    ) : (
                        <div className="space-y-2">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-400">Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="btn btn-xs btn-outline" onClick={() => updateQuantity(item._id, -1)}><MinusIcon className="w-4 h-4" /></button>
                                        <span>{item.quantity}</span>
                                        <button className="btn btn-xs btn-outline" onClick={() => updateQuantity(item._id, 1)}><PlusIcon className="w-4 h-4" /></button>
                                        <button className="btn btn-xs btn-ghost text-error" onClick={() => removeFromCart(item._id)}><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-body border-t-2 border-base-200">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="card-actions mt-4">
                        <button className="btn btn-primary btn-block" onClick={handleCheckout} disabled={cart.length === 0}>
                            Selesaikan Transaksi
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL PEMBAYARAN BARU */}
            <dialog id="payment_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Pilih Metode Pembayaran</h3>
                    <div className="py-4 grid grid-cols-2 gap-4">
                        <button onClick={() => processTransaction('Tunai')} className="btn btn-lg">Tunai</button>
                        <button onClick={() => processTransaction('QRIS')} className="btn btn-lg">QRIS</button>
                        <button onClick={() => processTransaction('GoFood')} className="btn btn-lg btn-success text-white">GoFood</button>
                        <button onClick={() => processTransaction('GrabFood')} className="btn btn-lg btn-success text-white">GrabFood</button>
                        <button onClick={() => processTransaction('ShopeeFood')} className="btn btn-lg btn-error text-white">ShopeeFood</button>
                    </div>
                    <div className="modal-action">
                        <form method="dialog"><button className="btn">Batal</button></form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Cashier;