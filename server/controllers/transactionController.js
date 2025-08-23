const Transaction = require('../models/Transaction');
const Store = require('../models/Store');
// KEMBALI MENGGUNAKAN LIBRARY ASLI
const TelegramBot = require('node-telegram-bot-api');

exports.createTransaction = async (req, res) => {
    const { items, totalAmount, paymentMethod } = req.body;
    if (!req.user.storeId) {
        return res.status(400).json({ msg: 'User does not have a store.' });
    }

    try {
        const newTransaction = new Transaction({
            storeId: req.user.storeId,
            items, totalAmount, paymentMethod
        });
        const transaction = await newTransaction.save();

        // --- LOGIKA NOTIFIKASI TELEGRAM KEMBALI SEPERTI SEMULA ---
        const store = await Store.findById(req.user.storeId);
        if (store && store.telegramBotToken && store.telegramChatId) {
            try {
                const bot = new TelegramBot(store.telegramBotToken);
                
                let messageText = `
🔔 *Transaksi Baru di ${store.name}!*
----------------------------------
**Total:** Rp ${totalAmount.toLocaleString('id-ID')}
**Metode:** ${paymentMethod}
**Waktu:** ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
----------------------------------
*Rincian Item:*
`;
                items.forEach(item => {
                    messageText += `- ${item.name} (${item.quantity}x)\n`;
                });

                // Kirim pesan menggunakan library node-telegram-bot-api
                await bot.sendMessage(store.telegramChatId, messageText, { parse_mode: 'Markdown' });

            } catch (telegramError) {
                console.error("Gagal mengirim notifikasi Telegram (real-time):", telegramError.message);
            }
        }

        res.status(201).json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTransactions = async (req, res) => {
    if (!req.user.storeId) {
        return res.status(400).json({ msg: 'User does not have a store.' });
    }
    try {
        const { date } = req.query;
        let query = { storeId: req.user.storeId };

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.createdAt = { $gte: startDate, $lte: endDate };
        }
        
        const transactions = await Transaction.find(query).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};