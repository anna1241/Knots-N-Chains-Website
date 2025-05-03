const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  productType: { 
    type: String, 
    enum: ['flower', 'keychain', 'earrings', 'other'],
    required: true 
  },
  size: { 
    type: String, 
    enum: ['small', 'medium', 'large'],
    required: true 
  },
  color: { type: String, required: true },
  designDetails: { type: String, required: true },
  additionalInfo: String,
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'approved', 'rejected', 'completed'],
    default: 'pending' 
  },
  adminNotes: String,
  estimatedPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);