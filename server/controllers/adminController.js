const User = require('../models/User');
const Store = require('../models/Store');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

exports.getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalStores = await Store.countDocuments();
        const totalTransactions = await Transaction.countDocuments();
        const totalRevenue = await Transaction.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            totalUsers,
            totalStores,
            totalTransactions,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Populate brings in the store details instead of just the ID
        const users = await User.find({ role: 'user' }).populate('storeId', 'name').select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Cascade delete: remove store, products, and transactions associated with the user
        if (user.storeId) {
            await Transaction.deleteMany({ storeId: user.storeId });
            await Product.deleteMany({ storeId: user.storeId });
            await Store.findByIdAndDelete(user.storeId);
        }

        await User.findByIdAndDelete(userId);

        res.json({ msg: 'User and all associated data have been deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.getUserFinancials = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user || !user.storeId) {
            return res.status(404).json({ msg: 'User or their store not found.' });
        }

        const totalTransactions = await Transaction.countDocuments({ storeId: user.storeId });
        const totalRevenue = await Transaction.aggregate([
            { $match: { storeId: user.storeId } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            email: user.email,
            storeId: user.storeId,
            totalTransactions,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};