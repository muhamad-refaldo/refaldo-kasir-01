import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { 
    HomeIcon, 
    CubeIcon, 
    ShoppingCartIcon, 
    ClockIcon, 
    Cog6ToothIcon, 
    ArrowRightOnRectangleIcon, 
    UserCircleIcon, 
    ShieldCheckIcon, 
    DocumentChartBarIcon,
    XMarkIcon,
    Bars3Icon
} from '@heroicons/react/24/outline'; // Menggunakan ikon outline untuk konsistensi

const Sidebar = () => {
    const [user, setUser] = useState({ role: 'user' });
    const [store, setStore] = useState({ name: 'Toko Anda' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State untuk mobile
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil data user dan toko sekaligus
                const [userRes, storeRes] = await Promise.all([
                    api.get('/auth'),
                    api.get('/stores')
                ]);
                setUser(userRes.data);
                setStore(storeRes.data);
            } catch (error) {
                console.error("Gagal mengambil data user/toko:", error);
            }
        };
        fetchData(); // <-- [PERBAIKAN] Mengganti fetchUser() menjadi fetchData()
    }, []);

    // Tutup sidebar mobile setiap kali pindah halaman
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        // Mengganti window.confirm dengan UI yang lebih modern akan lebih baik di masa depan
        if (window.confirm("Apakah Anda yakin ingin logout?")) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    // Kelompokkan menu untuk struktur yang lebih baik
    const mainMenuItems = [
        { name: 'Dashboard', path: '/', icon: <HomeIcon className="w-6 h-6" /> },
        { name: 'Kasir', path: '/cashier', icon: <ShoppingCartIcon className="w-6 h-6" /> },
        { name: 'Produk', path: '/products', icon: <CubeIcon className="w-6 h-6" /> },
        { name: 'Laporan Harian', path: '/history', icon: <ClockIcon className="w-6 h-6" /> },
        { name: 'Laporan Bulanan', path: '/reports/monthly', icon: <DocumentChartBarIcon className="w-6 h-6" /> }
    ];

    const secondaryMenuItems = [
        { name: 'Pengaturan', path: '/settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
        { name: 'Pembuat Web', path: '/about', icon: <UserCircleIcon className="w-6 h-6" /> }
    ];

    const adminMenuItems = [
        { name: 'Manajemen User', path: '/admin/users', icon: <ShieldCheckIcon className="w-6 h-6" /> }
    ];

    // Komponen NavLink yang bisa digunakan ulang untuk menghindari repetisi
    const NavItem = ({ to, icon, children }) => (
        <li>
            <NavLink 
                to={to} 
                end 
                className={({ isActive }) => 
                    `flex items-center p-3 my-1 rounded-lg transition-colors duration-200
                     ${isActive 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'}`
                }
            >
                {icon}
                <span className="ml-4">{children}</span>
            </NavLink>
        </li>
    );

    const sidebarContent = (
        <div className="flex flex-col h-full p-4 bg-slate-800 text-white">
            {/* Header Sidebar */}
            <div className="flex items-center justify-between p-2 mb-4">
                <h1 className="text-xl font-bold tracking-wider font-mono uppercase">{store.name}</h1>
                {/* Tombol close untuk mobile */}
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6"/>
                </button>
            </div>

            {/* Menu Utama */}
            <nav className="flex-grow">
                <ul>
                    {mainMenuItems.map(item => <NavItem key={item.path} to={item.path} icon={item.icon}>{item.name}</NavItem>)}
                </ul>

                <div className="divider my-4 border-slate-700"></div>

                <ul>
                    {secondaryMenuItems.map(item => <NavItem key={item.path} to={item.path} icon={item.icon}>{item.name}</NavItem>)}
                </ul>

                {/* Panel Admin (Kondisional) */}
                {user.role === 'superadmin' && (
                    <>
                        <div className="divider my-4 border-slate-700"></div>
                        <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Admin Panel</p>
                        <ul>
                            {adminMenuItems.map(item => <NavItem key={item.path} to={item.path} icon={item.icon}>{item.name}</NavItem>)}
                        </ul>
                    </>
                )}
            </nav>

            {/* Footer Sidebar (Logout) */}
            <div className="mt-auto">
                <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full p-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
                >
                    <ArrowRightOnRectangleIcon className="w-6 h-6" />
                    <span className="ml-4">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Tombol hamburger untuk membuka sidebar di mobile */}
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-slate-800/50 backdrop-blur-sm text-white"
            >
                <Bars3Icon className="w-6 h-6"/>
            </button>

            {/* Overlay untuk background saat sidebar mobile terbuka */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-40"></div>}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out 
                               ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                               lg:translate-x-0 lg:static lg:h-auto`}>
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;
