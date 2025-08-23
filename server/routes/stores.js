const express = require('express');
const router = express.Router();
const { getStore, updateStore } = require('../controllers/storeController');
const auth = require('../middleware/auth');

// @route   GET api/stores
// @desc    Get the current user's store
// @access  Private
router.get('/', auth, getStore);

// @route   PUT api/stores
// @desc    Update the current user's store
// @access  Private
router.put('/', auth, updateStore);

module.exports = router;