const { templates, algeriaWilayas, plans } = require('../config/constants');
const { addProduct, getUserProducts, addOrder, getDashboardStats, db } = require('../services/store');

function listTemplates(req, res) {
  return res.json({ templates, plans });
}

function listWilayas(req, res) {
  return res.json({ wilayas: algeriaWilayas });
}

function dashboard(req, res) {
  return res.json({
    stats: getDashboardStats(req.user.id),
    store: req.user.store,
    referral: {
      link: `https://storehub.app/ref/${req.user.referralCode}`,
      totalInvites: req.user.referralCount,
      rewardRule: '50 invited users = 10 days Pro once every 3 months',
    },
  });
}

function createProduct(req, res) {
  const { name, image, price, description } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'name and price are required' });
  }

  const product = addProduct({ userId: req.user.id, name, image, price, description });
  return res.status(201).json(product);
}

function listProducts(req, res) {
  return res.json({ products: getUserProducts(req.user.id) });
}

function createOrder(req, res) {
  const { customerName, phone, address, wilaya, municipality, items } = req.body;
  const order = addOrder({
    userId: req.user.id,
    customerName,
    phone,
    address,
    wilaya,
    municipality,
    items: items || [],
  });
  return res.status(201).json(order);
}

function listOrders(req, res) {
  const orders = db.orders.filter((o) => o.userId === req.user.id);
  return res.json({ orders });
}

module.exports = { listTemplates, listWilayas, dashboard, createProduct, listProducts, createOrder, listOrders };
