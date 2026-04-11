require('dotenv').config();
const { onRequest } = require('firebase-functions/v2/https');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const notificationRoutes = require('./src/routes/notifications');

const app = express();

const allowedOrigins = [
  'https://mern-realtime-platform.web.app',
  'https://mern-realtime-platform.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use('/api/', limiter);

require('./src/config/passport');

let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected && process.env.MONGO_URI) {
    await connectDB();
    isConnected = mongoose.connection.readyState === 1;
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

exports.api = onRequest({ region: 'us-central1', memory: '256MiB', invoker: 'public' }, app);
