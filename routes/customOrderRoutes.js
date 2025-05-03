const express = require('express');
const router = express.Router();
const CustomOrder = require('../models/CustomOrder');

// POST /api/custom-orders
router.post('/', async (req, res) => {
  try {
    const customOrder = new CustomOrder(req.body);
    const savedOrder = await customOrder.save();
    res.status(201).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error('Error creating custom order:', error);
    res.status(500).json({ success: false, message: 'Failed to create custom order' });
  }
});

module.exports = router;
