const User = require('../models/User');
const Store = require('../models/Store');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

// Fungsi untuk menghasilkan OTP 6 digit
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- [LOGIKA DIPERBARUI] ---
exports.register = async (req, res) => {
    const { name, storeName, email, password } = req.body; 
    try {
        let user = await User.findOne({ email });

        // Kasus 1: Email sudah ada dan terverifikasi. Hentikan proses.
        if (user && user.isVerified) {
            return res.status(400).json({ msg: 'Email ini sudah terdaftar dan aktif.' });
        }

        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP berlaku 10 menit

        // Kasus 2: Email sudah ada tapi BELUM terverifikasi.
        // Pengguna mencoba mendaftar ulang. Kita update data yang ada.
        if (user && !user.isVerified) {
            user.name = name;
            user.password = password; // Password akan di-hash lagi oleh pre-save hook di model User
            user.otp = otp;
            user.otpExpires = otpExpires;
            
            // Update juga nama tokonya jika ada
            await Store.findOneAndUpdate({ owner: user.id }, { name: storeName });

        } else {
        // Kasus 3: Email benar-benar baru. Buat user baru.
            const userCount = await User.countDocuments();
            const role = userCount === 0 ? 'superadmin' : 'user';

            user = new User({ 
                name, 
                email, 
                password, 
                role, 
                otp, 
                otpExpires,
                isVerified: false // Status awal selalu false
            });
        }

        // Simpan user (baik yang baru maupun yang diupdate)
        await user.save();

        // Jika ini user baru, buat juga tokonya
        if (!user.storeId) {
            const newStore = new Store({ name: storeName, owner: user.id });
            const store = await newStore.save();
            user.storeId = store.id;
            await user.save();
        }
        
        // Kirim email OTP
        const emailHtml = `<h2>Selamat Datang di REFALDO KASIR!</h2><p>Gunakan kode OTP ini untuk aktivasi akun Anda:</p><h3><b>${otp}</b></h3><p>Kode ini hanya berlaku selama 10 menit.</p>`;
        await sendEmail({
            email: user.email,
            subject: 'Kode Verifikasi REFALDO KASIR',
            html: emailHtml,
        });

        // Kirim respon sukses ke frontend
        res.status(201).json({ msg: 'Pendaftaran berhasil. Cek email Anda untuk OTP.', email: user.email });

    } catch (err) {
        console.error("Error pada proses registrasi:", err.message);
        res.status(500).send('Server error');
    }
};

// --- [FUNGSI BARU DITAMBAHKAN DI SINI] ---
exports.resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        // Cek jika user tidak ada atau sudah terverifikasi
        if (!user) {
            return res.status(404).json({ msg: 'Email tidak terdaftar.' });
        }
        if (user.isVerified) {
            return res.status(400).json({ msg: 'Akun ini sudah aktif dan terverifikasi.' });
        }

        // Buat OTP baru dan perbarui masa berlakunya
        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 menit dari sekarang
        await user.save();

        // Kirim ulang email OTP
        const emailHtml = `<h2>Kode Verifikasi Baru Anda</h2><p>Gunakan kode OTP ini untuk aktivasi akun Anda:</p><h3><b>${otp}</b></h3><p>Kode ini hanya berlaku selama 10 menit.</p>`;
        await sendEmail({
            email: user.email,
            subject: 'Kode Verifikasi Ulang REFALDO KASIR',
            html: emailHtml,
        });

        res.status(200).json({ msg: 'Kode OTP baru telah berhasil dikirim ulang.' });

    } catch (err) {
        console.error("Error pada kirim ulang OTP:", err.message);
        res.status(500).send('Server error');
    }
};


// Fungsi verifyOtp tidak perlu diubah, sudah benar
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ msg: 'OTP salah atau sudah kedaluwarsa.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const payload = { user: { id: user.id, role: user.role, storeId: user.storeId } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token, msg: 'Akun berhasil diverifikasi.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Fungsi login tidak perlu diubah, sudah benar
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Email atau password salah.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Email atau password salah.' });
        }

        if (!user.isVerified) {
            // Beri pesan spesifik jika akun belum diverifikasi
            return res.status(401).json({ msg: 'Akun Anda belum diverifikasi. Silakan cek email untuk kode OTP.' });
        }

        const payload = { user: { id: user.id, role: user.role, storeId: user.storeId } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// Fungsi forgotPassword tidak perlu diubah, sudah benar
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'Email tidak ditemukan.' });
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 menit
        await user.save();

        const emailHtml = `<h2>Reset Password Akun Anda</h2><p>Gunakan kode OTP ini:</p><h3><b>${otp}</b></h3>`;

        await sendEmail({
            email: user.email,
            subject: 'Kode Reset Password',
            html: emailHtml
        });

        res.json({ msg: 'OTP untuk reset password telah dikirim ke email Anda.', email: user.email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Fungsi resetPassword tidak perlu diubah, sudah benar
exports.resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'OTP salah atau kedaluwarsa.' });
        }

        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ msg: 'Password berhasil direset.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Fungsi getUser tidak perlu diubah, sudah benar
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
