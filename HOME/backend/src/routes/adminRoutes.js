const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const { listUsers, toggleUser, removeUser, createCode } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', auth, adminOnly, listUsers);
router.patch('/users/:id/toggle', auth, adminOnly, toggleUser);
router.delete('/users/:id', auth, adminOnly, removeUser);
router.post('/subscription-codes', auth, adminOnly, createCode);

module.exports = router;
