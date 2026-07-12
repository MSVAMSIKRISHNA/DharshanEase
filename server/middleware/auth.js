import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';

/**
 * Authentication middleware
 * Verifies JWT from Authorization header or cookies
 */
const auth = (req, _res, next) => {
  try {
    let token = null;

    /* Check Authorization header */
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    /* Check cookies as fallback */
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Invalid or expired token.'));
    }
  }
};

/**
 * Optional auth middleware
 * Sets req.user if token is present but does not block if missing
 */
const optionalAuth = (req, _res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      };
    }
  } catch {
    req.user = null;
  }

  next();
};

export { auth, optionalAuth };
