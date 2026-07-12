import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/index.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

/* Route imports */
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import templeRoutes from './routes/templeRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Connect to MongoDB */
connectDB();

/* Security middleware */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

/* CORS */
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* Body parsers */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* Request logging */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

/* Static files - uploads */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* API Routes */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/temples', templeRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/analytics', analyticsRoutes);

/* Health check */
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'DarshanEase API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

/* 404 handler for unknown API routes */
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* Global error handler */
app.use(errorHandler);

/* Start server */
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 DarshanEase server running on port ${PORT} in ${config.nodeEnv} mode`);
  logger.info(`📡 API available at http://localhost:${PORT}/api`);
});

export default app;
