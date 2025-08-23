const Transaction = require('../models/Transaction');
const Store = require('../models/Store');
const ExcelJS = require('exceljs');
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

// --- HELPER FUNCTIONS ---

const getDailyTransactions = async (storeId, date) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    return await Transaction.find({
        storeId,
        createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 'asc' });
};

const getMonthlyTransactions = async (storeId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
    return await Transaction.find({
        storeId,
        createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 'asc' });
};


// --- DAILY REPORTS ---

exports.generateExcelReport = async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ msg: 'Date query parameter is required.' });

    try {
        const transactions = await getDailyTransactions(req.user.storeId, date);
        const store = await Store.findById(req.user.storeId);
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Laporan Harian ${date}`);

        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = `Laporan Penjualan Harian - ${store.name}`;
        worksheet.getCell('A1').font = { bold: true, size: 16 };
        worksheet.getCell('A1').alignment = { horizontal: 'center' };

        worksheet.columns = [
            { header: 'Waktu', key: 'time', width: 15 },
            { header: 'Item', key: 'items', width: 50 },
            { header: 'Metode Bayar', key: 'payment', width: 20 },
            { header: 'Jumlah', key: 'total', width: 20 },
        ];
        worksheet.getRow(3).font = { bold: true };

        transactions.forEach(t => {
            worksheet.addRow({
                time: t.createdAt.toLocaleTimeString('id-ID'),
                items: t.items.map(item => `${item.name} (${item.quantity}x)`).join(', '),
                payment: t.paymentMethod,
                total: t.totalAmount
            });
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan-Harian-${store.name}-${date}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Gagal membuat laporan Excel harian:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.sendTelegramReport = async (req, res) => {
    const { date } = req.body;
    if (!date) return res.status(400).json({ msg: 'Date is required.' });

    try {
        const store = await Store.findById(req.user.storeId);
        if (!store.telegramBotToken || !store.telegramChatId) {
            return res.status(400).json({ msg: 'Telegram is not configured.' });
        }
        
        const transactions = await getDailyTransactions(req.user.storeId, date);
        const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
        const formattedDate = new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        
        let transactionDetails = '';
        transactions.forEach((trx, index) => {
            transactionDetails += `\n*Trx #${index + 1}* (${new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})\n`;
            trx.items.forEach(item => { transactionDetails += `- ${item.name} (${item.quantity}x)\n`; });
            transactionDetails += `_Total: Rp ${trx.totalAmount.toLocaleString('id-ID')} (${trx.paymentMethod})_\n`;
        });
        
        let messageText = `
📊 *Laporan Penjualan Harian*
Toko: *${store.name}*
Tanggal: *${formattedDate}*
----------------------------------
Total Transaksi: **${transactions.length}**
Total Pendapatan: **Rp ${totalRevenue.toLocaleString('id-ID')}**
----------------------------------
*Rincian Transaksi:*
${transactionDetails.length > 0 ? transactionDetails : 'Tidak ada transaksi.'}
        `;
        
        const bot = new TelegramBot(store.telegramBotToken);
        const messageParts = messageText.match(/[\s\S]{1,4096}/g) || [];
        for (const part of messageParts) {
            await bot.sendMessage(store.telegramChatId, part, { parse_mode: 'Markdown' });
        }
        
        res.json({ msg: 'Laporan detail telah dikirim ke Telegram.' });
    } catch (err) {
        console.error("Gagal mengirim laporan Telegram:", err.message);
        res.status(500).send('Server Error');
    }
};


// --- MONTHLY REPORTS ---

exports.getMonthlyReport = async (req, res) => {
    if (!req.user.storeId) {
        return res.status(400).json({ msg: 'User does not have a store.' });
    }

    const { year, month } = req.query;
    if (!year || !month) {
        return res.status(400).json({ msg: 'Year and month are required.' });
    }

    try {
        const monthlyTransactions = await getMonthlyTransactions(req.user.storeId, year, month);

        // 1. Hitung statistik dari data yang sudah diambil
        const totalSales = monthlyTransactions.reduce((sum, trx) => sum + trx.totalAmount, 0);
        const totalTransactions = monthlyTransactions.length;

        // 2. Cari produk terlaris dari data yang sudah diambil
        const itemCounter = {};
        monthlyTransactions.forEach(trx => {
            trx.items.forEach(item => {
                if (!itemCounter[item.name]) itemCounter[item.name] = 0;
                itemCounter[item.name] += item.quantity;
            });
        });
        const topProduct = Object.keys(itemCounter).reduce((a, b) => itemCounter[a] > itemCounter[b] ? a : b, '-');

        // 3. Olah data untuk grafik dari data yang sudah diambil
        const daysInMonth = new Date(year, month, 0).getDate();
        const salesByDate = {};
        monthlyTransactions.forEach(trx => {
            const dateString = new Date(trx.createdAt).toISOString().split('T')[0];
            if (!salesByDate[dateString]) salesByDate[dateString] = 0;
            salesByDate[dateString] += trx.totalAmount;
        });

        const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        const data = labels.map((day, i) => {
            const date = new Date(year, month - 1, i + 1);
            const dateString = date.toISOString().split('T')[0];
            return salesByDate[dateString] || 0;
        });

        // 4. Kirim semua data yang sudah diolah
        res.json({
            totalSales,
            totalTransactions,
            topProduct,
            chartData: { labels, data }
        });
    } catch (err) {
        console.error("Gagal mengambil laporan bulanan:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.generateMonthlyExcelReport = async (req, res) => {
    const { year, month } = req.query;
    try {
        const transactions = await getMonthlyTransactions(req.user.storeId, year, month);
        const store = await Store.findById(req.user.storeId);
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Laporan Bulan ${month}-${year}`);
        
        worksheet.mergeCells('A1:D1');
        worksheet.getCell('A1').value = `Laporan Penjualan Bulanan - ${store.name}`;
        worksheet.getCell('A1').font = { bold: true, size: 16 };

        worksheet.columns = [
            { header: 'Tanggal', key: 'date', width: 20 },
            { header: 'Item', key: 'items', width: 50 },
            { header: 'Metode Bayar', key: 'payment', width: 20 },
            { header: 'Jumlah', key: 'total', width: 20 },
        ];
        worksheet.getRow(3).font = { bold: true };

        transactions.forEach(t => {
            worksheet.addRow({
                date: new Date(t.createdAt).toLocaleDateString('id-ID'),
                items: t.items.map(item => `${item.name} (${item.quantity}x)`).join(', '),
                payment: t.paymentMethod,
                total: t.totalAmount
            });
        });
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan-Bulanan-${store.name}-${month}-${year}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Gagal membuat laporan Excel bulanan:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.sendMonthlyTelegramReport = async (req, res) => {
    const { year, month } = req.body;
    try {
        const store = await Store.findById(req.user.storeId);
        if (!store.telegramBotToken || !store.telegramChatId) {
            return res.status(400).json({ msg: 'Telegram is not configured.' });
        }
        
        const transactions = await getMonthlyTransactions(req.user.storeId, year, month);
        const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
        const monthName = new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' });
        
        // 1. Kelompokkan transaksi berdasarkan tanggal
        const transactionsByDate = {};
        transactions.forEach(trx => {
            const dateString = new Date(trx.createdAt).toLocaleDateString('id-ID', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
            if (!transactionsByDate[dateString]) {
                transactionsByDate[dateString] = [];
            }
            transactionsByDate[dateString].push(trx);
        });

        // 2. Buat string detail dari data yang sudah dikelompokkan
        let transactionDetails = '';
        for (const date in transactionsByDate) {
            transactionDetails += `\n\n*Tanggal: ${date}*\n`;
            let dailyTotal = 0;
            transactionsByDate[date].forEach((trx, index) => {
                transactionDetails += `  *Trx #${index + 1}* (${new Date(trx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})\n`;
                trx.items.forEach(item => {
                    transactionDetails += `  - ${item.name} (${item.quantity}x)\n`;
                });
                transactionDetails += `  _Total: Rp ${trx.totalAmount.toLocaleString('id-ID')} (${trx.paymentMethod})_\n`;
                dailyTotal += trx.totalAmount;
            });
            transactionDetails += `  *Total Pendapatan Tanggal Ini: Rp ${dailyTotal.toLocaleString('id-ID')}*`;
        }
        
        // 3. Gabungkan semua menjadi satu pesan
        let messageText = `
📊 *Laporan Penjualan Bulanan*
Toko: *${store.name}*
Periode: *${monthName} ${year}*
----------------------------------
*Total Keseluruhan Bulan Ini*
- Total Transaksi: **${transactions.length}**
- Total Pendapatan: **Rp ${totalRevenue.toLocaleString('id-ID')}**
----------------------------------
*Rincian Transaksi Harian:*
${transactionDetails.length > 0 ? transactionDetails : 'Tidak ada transaksi.'}
        `;
        
        const bot = new TelegramBot(store.telegramBotToken);
        const messageParts = messageText.match(/[\s\S]{1,4096}/g) || [];
        for (const part of messageParts) {
            await bot.sendMessage(store.telegramChatId, part, { parse_mode: 'Markdown' });
        }
        
        res.json({ msg: 'Laporan bulanan detail telah dikirim ke Telegram.' });
    } catch (err) {
        console.error("Gagal mengirim laporan Telegram bulanan:", err.message);
        res.status(500).send('Server Error');
    }
};