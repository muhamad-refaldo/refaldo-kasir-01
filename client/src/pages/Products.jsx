import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '' });
    const [editingId, setEditingId] = useState(null);

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

    const openModal = (product = null) => {
        if (product) {
            // PERBAIKAN DI SINI: Memberi nilai default '' jika data tidak ada
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
        document.getElementById('product_modal').showModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
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
            document.getElementById('product_modal').close();
        } catch (error) {
            console.error("Gagal menyimpan produk:", error);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Manajemen Produk</h1>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <PlusIcon className="w-6 h-6" /> Tambah Produk
                </button>
            </div>

            <div className="overflow-x-auto card bg-base-100 shadow-xl">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nama Produk</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Stok</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center"><span className="loading loading-spinner"></span></td></tr>
                        ) : (
                            products.map(product => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td><div className="badge badge-neutral">{product.category}</div></td>
                                    <td>Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                    <td>{product.stock}</td>
                                    <td className="flex gap-2">
                                        <button className="btn btn-sm btn-warning" onClick={() => openModal(product)}><PencilIcon className="w-4 h-4" /></button>
                                        <button className="btn btn-sm btn-error" onClick={() => handleDelete(product._id)}><TrashIcon className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <dialog id="product_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Nama Produk</span></label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input input-bordered" required />
                        </div>
                         <div className="form-control">
                            <label className="label"><span className="label-text">Kategori</span></label>
                            <input type="text" value={formData.category} placeholder="Contoh: Makanan, Minuman" onChange={e => setFormData({...formData, category: e.target.value})} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Harga</span></label>
                            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Stok</span></label>
                            <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="input input-bordered" required />
                        </div>
                        <div className="modal-action">
                            <button type="button" className="btn" onClick={() => document.getElementById('product_modal').close()}>Batal</button>
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Simpan'}</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default Products;