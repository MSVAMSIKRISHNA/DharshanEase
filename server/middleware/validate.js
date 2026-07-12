import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware that checks express-validator results
 * Throws ApiError with validation messages if any errors exist
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    throw ApiError.badRequest('Validation failed', messages);
  }
  next();
};

export default validate;
