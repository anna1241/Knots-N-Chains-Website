const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getProducts);
router.post('/', auth, admin, createProduct);
router.get('/:id', getProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;