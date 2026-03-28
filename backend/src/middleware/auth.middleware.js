const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { extractBearerToken } = require('../utils/token');

/**
 * Requires a valid JWT; sets req.user to the payload user id (string/ObjectId as stored in JWT).
 */
function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return next(new AppError('No token, authorization denied', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    return next();
  } catch {
    return next(new AppError('Token is not valid', 401));
  }
}

/**
 * Attaches req.user when a valid Bearer token is present; otherwise continues without auth.
 */
function optionalAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
    }
  } catch {
    // Invalid or expired token: treat as anonymous (same as original behavior).
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};
