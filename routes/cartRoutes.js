// routes/cartRoutes.js
const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/Product');  // Assuming you have a Product model
const router = express.Router();

// Get cart by user ID
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add item to cart
router.post('/:userId', async (req, res) => {
  try {
    const { productId, quantity, color } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({ userId: req.params.userId, items: [], totalPrice: 0 });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      // Update existing item
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ productId, quantity, color });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * product.price;  // Assuming product has a price field
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove item from cart
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the item from cart
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + item.quantity * item.productId.price;  // Assuming product has a price field
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
