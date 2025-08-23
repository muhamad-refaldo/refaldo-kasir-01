const express = require('express');
const router = express.Router();
const { 
    register, 
    verifyOtp, 
    login, 
    forgotPassword, 
    resetPassword, 
    getUser 
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/', auth, getUser);

module.exports = router;