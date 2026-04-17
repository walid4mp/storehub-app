const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, sanitizeUser } = require('../services/store');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'storehub_super_secret_change_me', { expiresIn: '7d' });
}

async function register(req, res) {
  const { name, email, password, storeName } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = createUser({ name, email, password: hashed, storeName, role: 'USER' });
  return res.status(201).json({ user: sanitizeUser(user), token: signToken(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = findUserByEmail(email || '');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const valid = await bcrypt.compare(password || '', user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  return res.json({ user: sanitizeUser(user), token: signToken(user) });
}

module.exports = { register, login };
