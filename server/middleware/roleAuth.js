import ApiError from '../utils/ApiError.js';

/**
 * Role-based authorization middleware
 * Restricts access to specific user roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'organizer', 'user')
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export default authorize;
