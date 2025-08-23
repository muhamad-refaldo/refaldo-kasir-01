const User = require('../models/User');
const Store = require('../models/Store');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    const { name, storeName, email, password } = req.body; 
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email ini sudah terdaftar.' });
        }

        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'superadmin' : 'user';
        const otp = generateOtp();
        const otpExpires = Date.now() + 10 * 60 * 1000;

        user = new User({ name, email, password, role, otp, otpExpires });
        await user.save();

        const newStore = new Store({ name: storeName, owner: user.id });
        const store = await newStore.save();

        user.storeId = store.id;
        await user.save();
        
        const emailHtml = `<h2>Selamat Datang di REFALDO KASIR!</h2><p>Gunakan kode OTP ini untuk aktivasi akun Anda:</p><h3><b>${otp}</b></h3>`;
        await sendEmail({
            email: user.email,
            subject: 'Kode Verifikasi REFALDO KASIR',
            html: emailHtml,
        });

        res.status(201).json({ msg: 'Pendaftaran berhasil. Cek email Anda untuk OTP.', email: user.email });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

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
            return res.status(401).json({ msg: 'Akun belum diverifikasi. Cek email Anda.' });
        }

        const payload = { user: { id: user.id, role: user.role, storeId: user.storeId } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

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

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};