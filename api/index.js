// Vercel Serverless Function Entry Point
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('../server/routes/auth');
const usersRoutes = require('../server/routes/users');
const servicesRoutes = require('../server/routes/services');
const vehiclesRoutes = require('../server/routes/vehicles');
const bookingsRoutes = require('../server/routes/bookings');
const paymentsRoutes = require('../server/routes/payments');
const kycRoutes = require('../server/routes/kyc');
const uploadsRoutes = require('../server/routes/uploads');
const notificationsRoutes = require('../server/routes/notifications');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Export for Vercel
module.exports = app;
