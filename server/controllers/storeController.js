const Store = require('../models/Store');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fungsi ini tidak lagi digunakan secara langsung, tapi kita simpan untuk referensi
exports.createStore = async (req, res) => {};

// Mengambil data toko yang sedang login
exports.getStore = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user.id });
        if (!store) {
            return res.status(404).json({ msg: 'Toko tidak ditemukan' });
        }
        res.json(store);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Memperbarui data toko yang sedang login
exports.updateStore = async (req, res) => {
    const { name, telegramBotToken, telegramChatId } = req.body;
    try {
        let store = await Store.findOne({ owner: req.user.id });
        if (!store) {
            return res.status(404).json({ msg: 'Toko tidak ditemukan' });
        }

        store.name = name || store.name;
        // Kita perbarui bahkan jika string-nya kosong, untuk memungkinkan user menghapus info bot
        store.telegramBotToken = telegramBotToken;
        store.telegramChatId = telegramChatId;

        await store.save();
        res.json({ store, msg: 'Pengaturan toko berhasil diperbarui.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};