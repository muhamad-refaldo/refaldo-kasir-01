const mongoose = require('mongoose');
const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  telegramBotToken: { type: String },
  telegramChatId: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Store', StoreSchema);