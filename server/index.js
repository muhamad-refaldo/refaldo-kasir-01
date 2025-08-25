require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- PERBAIKAN CORS ADA DI SINI ---

// Daftar URL yang diizinkan untuk mengakses backend ini
const allowedOrigins = [
  'https://refaldo-kasir-01.vercel.app', // URL Vercel Anda untuk production
  'http://localhost:5173'                 // URL development lokal Anda
];

const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan jika origin (sumber permintaan) ada di dalam daftar 'allowedOrigins'
    // atau jika tidak ada origin (misalnya, saat diakses via Postman atau tes server-ke-server)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Akses ditolak oleh kebijakan CORS'));
    }
  },
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
// ------------------------------------

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Terhubung... Mantap!'))
  .catch(err => console.error('Koneksi Gagal:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/products', require('./routes/products'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/history', require('./routes/history'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berlari kencang di port ${PORT}`));
