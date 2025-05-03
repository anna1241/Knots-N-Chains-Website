const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String },
  imageUrl: { type: String },        // Add this
  featured: { type: Boolean },       // Add this
  newArrival: { type: Boolean },     // Add this
  colors: [{ type: String }],        // Add this
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
