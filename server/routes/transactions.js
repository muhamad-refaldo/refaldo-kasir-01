const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions } = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// @route   POST api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', auth, createTransaction);

// @route   GET api/transactions
// @desc    Get all transactions for a store (with date filtering)
// @access  Private
router.get('/', auth, getTransactions);

module.exports = router;