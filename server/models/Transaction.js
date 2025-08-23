const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String, price: Number, quantity: Number,
  }],
  totalAmount: { type: Number, required: true },
  // Diperbarui dengan pilihan spesifik
  paymentMethod: { 
    type: String, 
    enum: ['Tunai', 'QRIS', 'GrabFood', 'ShopeeFood', 'GoFood'], 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);