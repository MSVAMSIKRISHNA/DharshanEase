import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 * Catches all errors thrown in controllers/services and sends standardized response
 */
const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  logger.error(err.message, {
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  /* Mongoose bad ObjectId */
  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid resource ID format');
  }

  /* Mongoose duplicate key */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = ApiError.conflict(`Duplicate value for '${field}'. This ${field} already exists.`);
  }

  /* Mongoose validation error */
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest('Validation failed', messages);
  }

  /* JWT errors */
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token. Please log in again.');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired. Please log in again.');
  }

  /* Multer file size error */
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = ApiError.badRequest('File size exceeds the maximum allowed limit.');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

export default errorHandler;
