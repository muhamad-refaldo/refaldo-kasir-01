import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import { 
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    MagnifyingGlassIcon,
    XMarkIcon,
    CubeTransparentIcon,
    ExclamationTriangleIcon // <-- Ikon baru untuk peringatan
} from '@heroicons/react/24/outline';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '' });
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // [FITUR BARU] Batas stok rendah, bisa diubah nanti di halaman Pengaturan
    const LOW_STOCK_THRESHOLD = 5;

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Gagal memuat produk:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const openModal = (product = null) => {
        if (product) {
            setFormData({ 
                name: product.name || '', 
                price: product.price || '', 
                stock: product.stock || '', 
                category: product.category || '' 
            });
            setEditingId(product._id);
        } else {
            setFormData({ name: '', price: '', stock: '', category: '' });
            setEditingId(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak dapat dibatalkan.")) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Gagal menghapus produk:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            fetchProducts();
            closeModal();
        } catch (error) {
            console.error("Gagal menyimpan produk:", error);
        }
    };
    
    return (
        <div className="p-4 sm:p-6 space-y-6 bg-slate-900 min-h-full">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Produk</h1>
                    <p className="text-md text-slate-400 mt-1">Kelola semua produk anda.</p>
                </div>
                <button 
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                    onClick={() => openModal()}
                >
                    <PlusIcon className="w-6 h-6" /> 
                    <span>Tambah Produk</span>
                </button>
            </div>

            {/* Panel Kontrol (Pencarian) */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400 w-5 h-5" />
                <input 
                    type="text"
                    placeholder="Cari produk berdasarkan nama atau kategori..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all duration-300"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Daftar Produk */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                {loading ? (
                    <div className="text-center p-10">
                        <span className="loading loading-dots loading-lg text-cyan-400"></span>
                        <p className="text-slate-400 mt-2">Memuat data inventaris...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-700/50 transition-colors duration-200">
                                <div className="flex-1 mb-4 sm:mb-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="text-lg font-semibold text-white">{product.name}</p>
                                        <span className="text-xs font-medium text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full">{product.category}</span>
                                        {/* [FITUR BARU] Label Stok Menipis */}
                                        {product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0 && (
                                            <span className="text-xs font-medium text-amber-300 bg-amber-900/50 px-2 py-1 rounded-full flex items-center gap-1">
                                                <ExclamationTriangleIcon className="w-4 h-4"/>
                                                Stok Menipis
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                             <span className="text-xs font-medium text-red-300 bg-red-900/50 px-2 py-1 rounded-full">
                                                Stok Habis
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-400 mt-1 space-x-4">
                                        <span>Harga: <span className="font-semibold text-slate-300">Rp {Number(product.price).toLocaleString('id-ID')}</span></span>
                                        <span>Stok: <span className="font-semibold text-slate-300">{product.stock}</span></span>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end sm:self-center">
                                    <button className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-full transition-colors" onClick={() => openModal(product)}><PencilSquareIcon className="w-5 h-5" /></button>
                                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors" onClick={() => handleDelete(product._id)}><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-10">
                        <CubeTransparentIcon className="w-16 h-16 mx-auto text-slate-600"/>
                        <h3 className="mt-4 text-xl font-semibold text-white">Inventaris Kosong</h3>
                        <p className="mt-1 text-slate-400">Belum ada produk yang ditambahkan atau tidak ada hasil yang cocok dengan pencarian Anda.</p>
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Produk (tidak berubah) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-lg bg-slate-900/80 border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <h3 className="font-bold text-2xl text-white mb-6">{editingId ? 'Edit Data Produk' : 'Tambah Produk Baru'}</h3>
                            <div className="relative">
                                <input type="text" placeholder="Nama Produk" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field-style" required />
                            </div>
                            <div className="relative">
                                <input type="text" placeholder="Kategori (Contoh: Makanan)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field-style" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input type="number" placeholder="Harga" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field-style" required />
                                </div>
                                <div className="relative">
                                    <input type="number" placeholder="Stok" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="input-field-style" required />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-6">
                                <button type="button" className="py-2 px-4 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors" onClick={closeModal}>Batal</button>
                                <button type="submit" className="py-2 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors">{editingId ? 'Update' : 'Simpan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`.input-field-style { width: 100%; background-color: rgba(30, 41, 59, 0.5); border: 1px solid #475569; border-radius: 0.5rem; padding: 0.75rem 1rem; color: white; transition: all 0.3s; } .input-field-style::placeholder { color: #64748b; } .input-field-style:focus { outline: none; --tw-ring-shadow: 0 0 0 2px #06b6d4; box-shadow: var(--tw-ring-shadow); border-color: #06b6d4; }`}</style>
        </div>
    );
};

export default Products;
