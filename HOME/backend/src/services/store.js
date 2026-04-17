const { plans } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

const db = {
  users: [],
  products: [],
  orders: [],
  subscriptionCodes: [],
};

function createUser(data) {
  const user = {
    id: uuidv4(),
    userPublicId: `SH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    referralCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
    referralCount: 0,
    referralRewardLastClaimAt: null,
    isActive: true,
    plan: 'FREE',
    subscriptionEndsAt: null,
    store: {
      name: data.storeName || 'My Store',
      slug: (data.storeName || 'my-store').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      templateId: 'free-1',
      language: 'ar',
      currency: 'DZD',
      themeColor: '#0F172A',
    },
    createdAt: new Date().toISOString(),
    ...data,
  };
  db.users.push(user);
  return user;
}

function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function findUserByEmail(email) {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function addProduct(data) {
  const product = { id: uuidv4(), createdAt: new Date().toISOString(), ...data };
  db.products.push(product);
  return product;
}

function getUserProducts(userId) {
  return db.products.filter((p) => p.userId === userId);
}

function addOrder(data) {
  const order = { id: uuidv4(), createdAt: new Date().toISOString(), status: 'NEW', ...data };
  db.orders.push(order);
  return order;
}

function getDashboardStats(userId) {
  const userProducts = getUserProducts(userId);
  const userOrders = db.orders.filter((o) => o.userId === userId);
  return {
    totalProducts: userProducts.length,
    totalOrders: userOrders.length,
    totalCustomers: new Set(userOrders.map((o) => o.phone)).size,
    currentPlan: plans[db.users.find((u) => u.id === userId)?.plan || 'FREE'],
  };
}

module.exports = { db, createUser, sanitizeUser, findUserByEmail, addProduct, getUserProducts, addOrder, getDashboardStats };
