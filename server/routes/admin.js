const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    deleteUser, 
    getAdminDashboardStats, 
    getUserFinancials 
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Apply auth and admin middleware to all routes in this file
router.use(auth, admin);

// @route   GET api/admin/stats
// @desc    Get dashboard stats for superadmin
// @access  Superadmin
router.get('/stats', getAdminDashboardStats);

// @route   GET api/admin/users
// @desc    Get all users and their stores
// @access  Superadmin
router.get('/users', getAllUsers);

// @route   DELETE api/admin/users/:id
// @desc    Delete a user and their associated data
// @access  Superadmin
router.delete('/users/:id', deleteUser);

// @route   GET api/admin/financials/:userId
// @desc    Get financial overview for a specific user/store
// @access  Superadmin
router.get('/financials/:userId', getUserFinancials);

module.exports = router;