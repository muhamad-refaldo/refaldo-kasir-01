const express = require('express');
const router = express.Router();
const { 
    generateExcelReport, 
    sendTelegramReport,
    getMonthlyReport,
    generateMonthlyExcelReport, // <-- Import yang hilang
    sendMonthlyTelegramReport   // <-- Import yang hilang
} = require('../controllers/reportController');
const auth = require('../middleware/auth');

// Rute untuk Laporan Harian
router.get('/excel', auth, generateExcelReport);
router.post('/telegram', auth, sendTelegramReport);

// Rute untuk Laporan Bulanan
router.get('/monthly', auth, getMonthlyReport);
router.get('/monthly/excel', auth, generateMonthlyExcelReport); // <-- Rute baru
router.post('/monthly/telegram', auth, sendMonthlyTelegramReport); // <-- Rute baru

module.exports = router;