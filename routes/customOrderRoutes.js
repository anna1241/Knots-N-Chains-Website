const express = require('express');
const router = express.Router();
const {
  createCustomOrder,
  getMyCustomOrders,
  getCustomOrders,
  updateCustomOrderStatus
} = require('../controllers/customOrderController');
const { auth, admin } = require('../middleware/auth');

router.route('/')
  .post(createCustomOrder);

router.route('/myorders')
  .get(auth, getMyCustomOrders);

router.route('/admin')
  .get(auth, admin, getCustomOrders);

router.route('/:id/status')
  .put(auth, admin, updateCustomOrderStatus);

module.exports = router;