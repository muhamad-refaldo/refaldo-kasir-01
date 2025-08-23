import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
    ChartBarIcon, ShoppingCartIcon, ArchiveBoxIcon, ClockIcon, 
    Cog6ToothIcon, ArrowRightStartOnRectangleIcon, UserCircleIcon, 
    ShieldCheckIcon, DocumentChartBarIcon // <-- Icon baru
} from '@heroicons/react/24/solid';

const Sidebar = () => {
    const [user, setUser] = useState({ role: 'user' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/auth');
                setUser(res.data);
            } catch (error) {
                console.error("Gagal mengambil data user untuk menu admin:", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <ChartBarIcon className="w-6 h-6" /> },
        { name: 'Produk', path: '/products', icon: <ArchiveBoxIcon className="w-6 h-6" /> },
        { name: 'Kasir', path: '/cashier', icon: <ShoppingCartIcon className="w-6 h-6" /> },
        { name: 'History', path: '/history', icon: <ClockIcon className="w-6 h-6" /> },
        { name: 'Laporan Bulanan', path: '/reports/monthly', icon: <DocumentChartBarIcon className="w-6 h-6" /> }
    ];

    return (
        <ul className="menu p-4 w-60 min-h-full bg-base-100 text-base-content">
            <li className="text-xl font-bold p-4">REFALDO KASIR</li>
            <div className="divider"></div>
            {menuItems.map((item) => (
                <li key={item.name}>
                    <NavLink to={item.path} end className={({ isActive }) => isActive ? "active" : ""}>
                        {item.icon} {item.name}
                    </NavLink>
                </li>
            ))}
            
            <div className="divider"></div>
            <li>
              <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
                <Cog6ToothIcon className="w-6 h-6" /> Pengaturan
              </NavLink>
            </li>
             <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
                <UserCircleIcon className="w-6 h-6" /> Tentang Saya
              </NavLink>
            </li>

            {user.role === 'superadmin' && (
                <>
                  <div className="divider"></div>
                  <li className="menu-title"><span>Admin Panel</span></li>
                  <li>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
                        <ShieldCheckIcon className="w-6 h-6" /> Manajemen User
                    </NavLink>
                  </li>
                </>
            )}

            <div className="divider mt-auto"></div>
            <li>
                <button onClick={handleLogout}>
                    <ArrowRightStartOnRectangleIcon className="w-6 h-6" /> Logout
                </button>
            </li>
        </ul>
    );
};

export default Sidebar;