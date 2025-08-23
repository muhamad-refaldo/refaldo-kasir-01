import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { TrashIcon } from '@heroicons/react/24/outline';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (userId) => {
        if (window.confirm("Yakin ingin menghapus user ini beserta semua data tokonya? Aksi ini tidak bisa dibatalkan.")) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
            } catch (error) {
                console.error("Gagal menghapus pengguna:", error);
                alert("Gagal menghapus pengguna.");
            }
        }
    };
    
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Manajemen Pengguna</h1>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Nama Toko</th>
                    <th className="text-center">Aksi</th>
                </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center"><span className="loading loading-spinner"></span></td></tr>
              ) : (
                users.map(user => (
                    <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.storeId?.name || <span className="text-gray-500 italic">N/A</span>}</td>
                        <td className="text-center">
                            <button onClick={() => handleDelete(user._id)} className="btn btn-error btn-sm btn-ghost">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default UserManagement;