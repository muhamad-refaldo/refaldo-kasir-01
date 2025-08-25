import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
    PlusIcon, 
    MinusIcon, 
    TrashIcon, 
    MagnifyingGlassIcon,
    XMarkIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    QrCodeIcon,
    TruckIcon
} from '@heroicons/react/24/outline';

const Cashier = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // [FITUR BARU] Batas stok rendah
    const LOW_STOCK_THRESHOLD = 5;

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
                if (existingItem.quantity >= product.stock) return currentCart;
                return currentCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            if (product.stock > 0) {
                 return [...currentCart, { ...product, quantity: 1 }];
            }
            return currentCart;
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart(currentCart => {
            const itemToUpdate = currentCart.find(item => item._id === productId);
            const productInStock = products.find(p => p._id === productId);
            if (amount > 0 && itemToUpdate.quantity + amount > productInStock.stock) {
                return currentCart;
            }
            return currentCart
                .map(item =>
                    item._id === productId ? { ...item, quantity: item.quantity + amount } : item
                )
                .filter(item => item.quantity > 0);
        });
    };

    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item._id !== productId));
    };

    const totalAmount = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const processTransaction = async (paymentMethod) => {
        setIsModalOpen(false);
        const transactionData = {
            items: cart.map(item => ({
                productId: item._id, name: item.name, price: item.price, quantity: item.quantity,
            })),
            totalAmount: totalAmount, paymentMethod: paymentMethod,
        };
        try {
            await api.post('/transactions', transactionData);
            setCart([]);
            navigate('/success', { state: { totalAmount, paymentMethod, items: transactionData.items } });
        } catch (error) {
            console.error("Gagal melakukan checkout:", error);
            alert("Gagal menyimpan transaksi.");
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-900 font-sans">
            {/* Kolom Kiri: Daftar Produk */}
            <div className="flex-1 lg:w-3/5 xl:w-2/3 p-4 sm:p-6 flex flex-col">
                <h1 className="text-3xl font-bold text-white mb-4">Terminal Kasir</h1>
                <div className="relative mb-4">
                    <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Cari produk..." 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex justify-center items-center h-full"><span className="loading loading-dots loading-lg text-cyan-400"></span></div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(product => (
                                <div 
                                    key={product._id} 
                                    className={`relative rounded-lg overflow-hidden border transition-all duration-300 transform hover:-translate-y-1 group
                                                ${product.stock > 0 ? 'cursor-pointer border-slate-700 hover:border-cyan-500' : 'cursor-not-allowed border-slate-800'}`}
                                    onClick={() => addToCart(product)}
                                >
                                    {/* [FITUR BARU] Peringatan Stok Rendah */}
                                    {product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0 && (
                                        <div className="absolute top-1 right-1 px-1.5 py-0.5 text-xs bg-amber-500 text-white rounded-full font-bold z-10">
                                            SISA {product.stock}
                                        </div>
                                    )}
                                    <div className="p-3 bg-slate-800">
                                        <h3 className="font-bold text-white truncate">{product.name}</h3>
                                        <p className="text-sm text-cyan-400 font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                            <p className="text-white font-bold text-sm">HABIS</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Kolom Kanan: Keranjang & Checkout (tidak berubah) */}
            <div className="lg:w-2/5 xl:w-1/3 bg-slate-800/50 border-l border-slate-700 flex flex-col h-full">
                <div className="p-6 flex-grow overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white">Keranjang</h2>
                    <div className="mt-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="text-center py-16">
                                <ShoppingCartIcon className="w-16 h-16 mx-auto text-slate-600"/>
                                <p className="mt-4 text-slate-400">Keranjang masih kosong.</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item._id} className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-semibold text-white truncate">{item.name}</p>
                                        <p className="text-sm text-slate-400">Rp {item.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="p-1 rounded-full hover:bg-slate-700" onClick={() => updateQuantity(item._id, -1)}><MinusIcon className="w-4 h-4 text-slate-400" /></button>
                                        <span className="font-bold text-white w-5 text-center">{item.quantity}</span>
                                        <button className="p-1 rounded-full hover:bg-slate-700" onClick={() => updateQuantity(item._id, 1)}><PlusIcon className="w-4 h-4 text-slate-400" /></button>
                                    </div>
                                    <button className="p-1 text-red-400 hover:text-red-300" onClick={() => removeFromCart(item._id)}><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="p-6 border-t border-slate-700 bg-slate-800">
                    <div className="flex justify-between items-center text-slate-300 mb-4">
                        <span className="text-lg">Subtotal</span>
                        <span className="text-lg font-semibold">Rp {totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <button 
                        className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500 text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 text-lg" 
                        onClick={() => setIsModalOpen(true)} 
                        disabled={cart.length === 0 || loading}
                    >
                        Lanjutkan Pembayaran
                    </button>
                </div>
            </div>

            {/* Modal Pembayaran (tidak berubah) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-md bg-slate-900/80 border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <h3 className="font-bold text-2xl text-white mb-6 text-center">Pilih Metode Pembayaran</h3>
                        <div className="space-y-3">
                            <button onClick={() => processTransaction('Tunai')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 transition-all">
                                <CreditCardIcon className="w-8 h-8 text-cyan-400"/>
                                <span className="text-lg font-semibold text-white">Tunai</span>
                            </button>
                            <button onClick={() => processTransaction('QRIS')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 transition-all">
                                <QrCodeIcon className="w-8 h-8 text-cyan-400"/>
                                <span className="text-lg font-semibold text-white">QRIS</span>
                            </button>
                            <div className="divider border-slate-700">Lainnya</div>
                            <button onClick={() => processTransaction('GoFood')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 transition-all">
                                <TruckIcon className="w-8 h-8 text-green-400"/>
                                <span className="text-lg font-semibold text-white">GoFood</span>
                            </button>
                             <button onClick={() => processTransaction('GrabFood')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-green-500 transition-all">
                                <TruckIcon className="w-8 h-8 text-green-400"/>
                                <span className="text-lg font-semibold text-white">GrabFood</span>
                            </button>
                            <button onClick={() => processTransaction('ShopeeFood')} className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-orange-500 transition-all">
                                <TruckIcon className="w-8 h-8 text-orange-400"/>
                                <span className="text-lg font-semibold text-white">ShopeeFood</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cashier;
