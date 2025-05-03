const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  postalCode: String,
  paymentMethod: String,
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      quantity: Number,
      imageUrl: String,
    },
  ],
  total: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
