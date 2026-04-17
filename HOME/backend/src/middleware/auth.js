const jwt = require('jsonwebtoken');
const { db } = require('../services/store');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'storehub_super_secret_change_me');
    const user = db.users.find((u) => u.id === payload.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Account disabled or not found' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admins only' });
  }
  return next();
}

module.exports = { auth, adminOnly };
