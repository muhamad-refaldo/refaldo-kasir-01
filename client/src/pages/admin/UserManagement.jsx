import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { TrashIcon, UserGroupIcon, ShieldCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    // State baru untuk modal konfirmasi penghapusan
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (error) {
                console.error("Gagal memuat data pengguna:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const openDeleteConfirm = (user) => {
        setUserToDelete(user);
    };

    const closeDeleteConfirm = () => {
        setUserToDelete(null);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/admin/users/${userToDelete._id}`);
            setUsers(users.filter(u => u._id !== userToDelete._id));
            closeDeleteConfirm(); // Tutup modal setelah berhasil
        } catch (error) {
            console.error("Gagal menghapus pengguna:", error);
            alert("Gagal menghapus pengguna.");
            closeDeleteConfirm();
        }
    };
    
    return (
      <div className="p-4 sm:p-6 space-y-6 bg-slate-900 min-h-full">
        {/* Header Halaman */}
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Manajemen Pengguna</h1>
            <p className="text-md text-slate-400 mt-1">Kelola semua pengguna yang terdaftar di sistem.</p>
        </div>

        {/* Daftar Pengguna */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl">
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">Daftar Pengguna Terdaftar</h2>
            </div>
            {loading ? (
                <div className="text-center p-10">
                    <span className="loading loading-dots loading-lg text-cyan-400"></span>
                    <p className="text-slate-400 mt-2">Memuat data kru...</p>
                </div>
            ) : users.length > 0 ? (
                <div className="divide-y divide-slate-700">
                    {users.map(user => (
                        <div key={user._id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-1 mb-4 sm:mb-0">
                                <div className="flex items-center gap-3">
                                    <p className="text-lg font-semibold text-white">{user.name}</p>
                                    {user.role === 'superadmin' && (
                                        <span className="text-xs font-medium text-amber-300 bg-amber-900/50 px-2 py-1 rounded-full flex items-center gap-1">
                                            <ShieldCheckIcon className="w-4 h-4"/>
                                            Super Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{user.email}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                    Toko: <span className="font-semibold text-slate-400">{user.storeId?.name || 'N/A'}</span>
                                </p>
                            </div>
                            <div className="self-end sm:self-center">
                                {/* Tombol hapus hanya muncul jika bukan superadmin */}
                                {user.role !== 'superadmin' && (
                                    <button 
                                        onClick={() => openDeleteConfirm(user)} 
                                        className="flex items-center gap-2 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-200"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                        <span>Hapus</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10">
                    <UserGroupIcon className="w-16 h-16 mx-auto text-slate-600"/>
                    <h3 className="mt-4 text-xl font-semibold text-white">Tidak Ada Pengguna Lain</h3>
                    <p className="mt-1 text-slate-400">Saat ini hanya Anda yang terdaftar di sistem.</p>
                </div>
            )}
        </div>

        {/* Modal Konfirmasi Hapus */}
        {userToDelete && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="relative w-full max-w-md bg-slate-900/80 border border-red-500/50 rounded-2xl shadow-2xl shadow-red-500/10 p-6 text-center">
                    <button onClick={closeDeleteConfirm} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <TrashIcon className="w-16 h-16 mx-auto text-red-500"/>
                    <h3 className="font-bold text-2xl text-white mt-4">Anda Yakin?</h3>
                    <p className="text-slate-400 mt-2">
                        Anda akan menghapus pengguna <strong className="text-white">{userToDelete.name}</strong> secara permanen. Semua data toko dan transaksi yang terkait akan hilang.
                    </p>
                    <p className="text-amber-400 font-semibold mt-2">Aksi ini tidak dapat dibatalkan.</p>
                    <div className="flex justify-center gap-4 mt-6">
                        <button className="py-2 px-6 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors" onClick={closeDeleteConfirm}>Batal</button>
                        <button className="py-2 px-6 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors" onClick={handleDelete}>Ya, Hapus Pengguna</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
};

export default UserManagement;
