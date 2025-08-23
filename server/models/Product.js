const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true, trim: true }, // <-- TAMBAHKAN INI
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);