const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.getHistorySummary = async (req, res) => {
    if (!req.user.storeId) {
        return res.status(400).json({ msg: 'User does not have a store.' });
    }

    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ msg: 'Date query parameter is required.' });
    }

    const storeId = new mongoose.Types.ObjectId(req.user.storeId);
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    try {
        const summary = await Transaction.aggregate([
            { $match: { storeId: storeId, createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    grandTotal: { $sum: '$totalAmount' },
                    totalCash: {
                        $sum: { $cond: [{ $eq: ['$paymentMethod', 'Tunai'] }, '$totalAmount', 0] }
                    },
                    totalQris: {
                        $sum: { $cond: [{ $eq: ['$paymentMethod', 'QRIS'] }, '$totalAmount', 0] }
                    },
                    totalOnline: {
                        $sum: { $cond: [{ $in: ['$paymentMethod', ['GoFood', 'GrabFood', 'ShopeeFood']] }, '$totalAmount', 0] }
                    }
                }
            }
        ]);

        if (summary.length === 0) {
            return res.json({
                totalTransactions: 0, grandTotal: 0,
                totalCash: 0, totalQris: 0, totalOnline: 0,
            });
        }
        
        res.json(summary[0]);

    } catch (err) {
        console.error("Gagal mengambil ringkasan riwayat:", err.message);
        res.status(500).send('Server Error');
    }
};