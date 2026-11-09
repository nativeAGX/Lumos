const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Enforce required environment variables (fail fast if JWT_SECRET is missing)
if (!process.env.JWT_SECRET) {
  console.error('\n🔴 FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is not defined.');
  console.error('   Please set JWT_SECRET in your server/.env file before running the server.\n');
  process.exit(1);
}

const connectDB = require('./config/db');
const { autoSeedIfEmpty } = require('./seeder/seedData');

// Route imports
const poleRoutes = require('./routes/poleRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const aiIntakeRoutes = require('./routes/aiIntakeRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB().then((conn) => {
  if (conn) {
    autoSeedIfEmpty();
  }
});

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly permissive CORS
    },
    credentials: true
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ONLINE',
    service: 'Lumos Municipal SCADA & Civic Management API',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      status: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      databaseName: mongoose.connection.name || 'lumos_db'
    }
  });
});

// Mount API routes
app.use('/api/poles', poleRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/intakes', aiIntakeRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Lumos Municipal Streetlight SCADA & Civic Management Backend API',
    endpoints: {
      health: '/api/health',
      poles: '/api/poles',
      grievances: '/api/grievances',
      intakes: '/api/intakes',
      workOrders: '/api/work-orders',
      technician: '/api/technician/queue',
      analytics: '/api/analytics',
      auth: '/api/auth/users'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Lumos Municipal Express Backend is running on: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 API Endpoints: http://localhost:${PORT}/api/poles`);
});
