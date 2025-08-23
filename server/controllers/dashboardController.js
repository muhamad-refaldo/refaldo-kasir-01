const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    if (!req.user.storeId) {
        return res.status(400).json({ msg: 'User does not have a store.' });
    }
    const storeId = req.user.storeId;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayStats = await Transaction.aggregate([
            { $match: { storeId: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: today, $lt: tomorrow } } },
            { $group: { _id: null, totalSales: { $sum: '$totalAmount' }, totalTransactions: { $sum: 1 } } }
        ]);

        const topProductToday = await Transaction.aggregate([
            { $match: { storeId: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: today, $lt: tomorrow } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.name', totalQuantity: { $sum: '$items.quantity' } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 1 }
        ]);

        const totalProducts = await Product.countDocuments({ storeId });
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const weeklySales = await Transaction.aggregate([
            { $match: { storeId: new mongoose.Types.ObjectId(storeId), createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Jakarta" } },
                    dailySales: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Membuat peta penjualan untuk pencocokan yang lebih mudah
        const salesMap = new Map(weeklySales.map(item => [item._id, item.dailySales]));

        const labels = [];
        const data = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            
            // Format tanggal YYYY-MM-DD yang konsisten
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            labels.push(date.toLocaleDateString('id-ID', { weekday: 'short' }));
            data.push(salesMap.get(dateString) || 0); // Ambil data dari peta atau beri nilai 0
        }

        const chartData = { labels, data };

        // ===== BUKTI FINAL =====
        console.log("Data final yang dikirim ke frontend:", chartData);
        // ========================

        const stats = {
            todaySales: todayStats[0]?.totalSales || 0,
            todayTransactions: todayStats[0]?.totalTransactions || 0,
            topProduct: topProductToday[0]?._id || '-',
            totalProducts: totalProducts,
            chartData: chartData
        };

        res.json(stats);

    } catch (err) {
        console.error("Gagal mengambil statistik dashboard:", err.message);
        res.status(500).send('Server Error');
    }
};