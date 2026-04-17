const express = require('express');
const { auth } = require('../middleware/auth');
const {
  listTemplates,
  listWilayas,
  dashboard,
  createProduct,
  listProducts,
  createOrder,
  listOrders,
} = require('../controllers/storeController');
const { activateSubscriptionCode } = require('../controllers/subscriptionController');

const router = express.Router();

router.get('/templates', listTemplates);
router.get('/wilayas', listWilayas);
router.get('/dashboard', auth, dashboard);
router.get('/products', auth, listProducts);
router.post('/products', auth, createProduct);
router.get('/orders', auth, listOrders);
router.post('/orders', auth, createOrder);
router.post('/subscriptions/redeem-code', auth, activateSubscriptionCode);

module.exports = router;
