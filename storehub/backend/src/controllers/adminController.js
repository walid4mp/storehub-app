const bcrypt = require('bcryptjs');
const { db, sanitizeUser, createUser } = require('../services/store');
const { generateSubscriptionCode } = require('../services/codeService');

async function seedAdmin() {
  if (!db.users.find((u) => u.role === 'ADMIN')) {
    const password = await bcrypt.hash('admin123', 10);
    createUser({
      name: 'StoreHub Admin',
      email: 'admin@storehub.local',
      password,
      role: 'ADMIN',
      storeName: 'StoreHub HQ',
    });
  }
}

function listUsers(req, res) {
  return res.json({ users: db.users.map(sanitizeUser) });
}

function toggleUser(req, res) {
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isActive = !user.isActive;
  return res.json({ message: 'User updated', user: sanitizeUser(user) });
}

function removeUser(req, res) {
  const index = db.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  db.users.splice(index, 1);
  return res.json({ message: 'User removed' });
}

function createCode(req, res) {
  const { plan, days } = req.body;
  if (!['BASIC', 'PRO'].includes(plan)) {
    return res.status(400).json({ message: 'plan must be BASIC or PRO' });
  }
  const code = generateSubscriptionCode(plan, days || 30);
  return res.status(201).json(code);
}

module.exports = { seedAdmin, listUsers, toggleUser, removeUser, createCode };
