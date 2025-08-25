import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Halaman-halaman
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Success from './pages/Success';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Cashier from './pages/Cashier';
import History from './pages/History';
import About from './pages/About';
import MonthlyReport from './pages/MonthlyReport'; // <-- Import baru
import UserManagement from './pages/admin/UserManagement';
// import TambahProduk from './pages/TambahProduk'; // <-- Impor komponen baru

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success" element={<Success />} />
        
        {/* Rute Aplikasi yang Dilindungi */}
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        {/* <Route path="/produk/tambah" element={<ProtectedRoute><Layout><TambahProduk /></Layout></ProtectedRoute>} /> */}
        <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="/cashier" element={<ProtectedRoute><Layout><Cashier /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><Layout><About /></Layout></ProtectedRoute>} />
        <Route path="/reports/monthly" element={<ProtectedRoute><Layout><MonthlyReport /></Layout></ProtectedRoute>} />

        {/* Rute Khusus Admin */}
        <Route path="/admin/users" element={<ProtectedRoute><Layout><UserManagement /></Layout></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;