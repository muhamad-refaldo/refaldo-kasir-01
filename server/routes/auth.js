const express = require('express');
const router = express.Router();

// Pastikan 'resendOtp' ada di dalam daftar impor ini
const { 
    register, 
    verifyOtp, 
    login, 
    forgotPassword, 
    resetPassword, 
    getUser,
    resendOtp 
} = require('../controllers/authController');

const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Pastikan baris ini menggunakan 'resendOtp' yang sudah diimpor
router.post('/resend-otp', resendOtp); 

router.get('/', auth, getUser);

module.exports = router;