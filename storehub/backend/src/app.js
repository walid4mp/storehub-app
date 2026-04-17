const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'StoreHub API' }));
app.use('/api/auth', authRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
