const express = require('express');
const router = express.Router();
const { getHistorySummary } = require('../controllers/historyController');
const auth = require('../middleware/auth');

// @route   GET api/history/summary
// @desc    Get summary statistics for the history page
// @access  Private
router.get('/summary', auth, getHistorySummary);

module.exports = router;