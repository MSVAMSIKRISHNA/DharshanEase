import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

/**
 * Generate a unique booking ID with prefix
 * Format: DE-YYYYMMDD-XXXXXX
 */
export const generateBookingId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DE-${dateStr}-${random}`;
};

/**
 * Generate a unique transaction ID
 */
export const generateTransactionId = () => {
  return `TXN-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
};

/**
 * Generate a random token for password reset / email verification
 */
export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a token for secure storage
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Build pagination object from query params
 */
export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build sort object from query param
 * e.g. "name" => { name: 1 }, "-createdAt" => { createdAt: -1 }
 */
export const getSortOptions = (sortQuery, defaultSort = '-createdAt') => {
  const sortStr = sortQuery || defaultSort;
  const sortObj = {};
  sortStr.split(',').forEach((field) => {
    if (field.startsWith('-')) {
      sortObj[field.slice(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });
  return sortObj;
};

/**
 * Build filter object for MongoDB queries
 */
export const buildFilters = (query, allowedFields = []) => {
  const filters = {};
  allowedFields.forEach((field) => {
    if (query[field] !== undefined && query[field] !== '') {
      filters[field] = query[field];
    }
  });
  return filters;
};

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Slugify a string
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * Run database operations inside a transaction if replica set/sharded cluster is active,
 * otherwise execute without a session/transaction.
 */
export const runInTransaction = async (callback) => {
  const isStandalone = mongoose.connection.client?.topology?.description?.type === 'Single';

  if (isStandalone) {
    return await callback(null);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

