const mongoose = require('mongoose');

const CustomOrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  size: String,
  color: String,
  design: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CustomOrder', CustomOrderSchema);