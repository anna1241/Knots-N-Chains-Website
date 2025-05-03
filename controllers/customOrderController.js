const CustomOrder = require('../models/CustomOrder');
const nodemailer = require('nodemailer');

// @desc    Create custom order
// @route   POST /api/custom-orders
// @access  Public
exports.createCustomOrder = async (req, res) => {
  try {
    const customOrder = new CustomOrder(req.body);
    await customOrder.save();
    
    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'hello@knotsnchains.com',
      subject: 'New Custom Order Request',
      text: `You have a new custom order request from ${customOrder.name} (${customOrder.email}).\n\nProduct Type: ${customOrder.productType}\nSize: ${customOrder.size}\nColors: ${customOrder.color}\nDesign Details: ${customOrder.designDetails}`
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(201).json(customOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's custom orders
// @route   GET /api/custom-orders/myorders
// @access  Private
exports.getMyCustomOrders = async (req, res) => {
  try {
    const customOrders = await CustomOrder.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(customOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all custom orders (Admin)
// @route   GET /api/custom-orders/admin
// @access  Private/Admin
exports.getCustomOrders = async (req, res) => {
  try {
    const customOrders = await CustomOrder.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json(customOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update custom order status (Admin)
// @route   PUT /api/custom-orders/:id/status
// @access  Private/Admin
exports.updateCustomOrderStatus = async (req, res) => {
  try {
    const { status, adminNotes, estimatedPrice } = req.body;
    const customOrder = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, estimatedPrice },
      { new: true }
    );
    
    if (!customOrder) {
      return res.status(404).json({ message: 'Custom order not found' });
    }
    
    // Send email to customer if status changed to reviewed or completed
    if (status === 'reviewed' || status === 'completed') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customOrder.email,
        subject: `Your Custom Order Update - ${customOrder.productType}`,
        text: `Your custom order has been updated to status: ${status}.\n\nAdmin Notes: ${adminNotes || 'None'}\nEstimated Price: ${estimatedPrice || 'Not set yet'}`
      };
      
      await transporter.sendMail(mailOptions);
    }
    
    res.json(customOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};