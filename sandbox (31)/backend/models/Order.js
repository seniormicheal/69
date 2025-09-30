const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  guestId: { type: String, required: false, index: true },
  orderId_5sim: { type: String, required: true, unique: true },
  service_name: { type: String, required: true },
  country: { type: String, required: true },
  serviceId: { type: String, required: false }, // New field for reordering
  number: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  smsCode: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

module.exports = mongoose.model('Order', OrderSchema);
