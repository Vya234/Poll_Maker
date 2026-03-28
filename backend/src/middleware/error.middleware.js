const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Not found - ${req.originalUrl}`, 404));
}

/**
 * Maps known error types to HTTP responses; avoids duplicating try/catch response shapes in every route.
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err instanceof mongoose.Error.CastError && err.path === '_id') {
    statusCode = 400;
    message = 'Invalid resource id';
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token is not valid';
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'User already exists';
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  const body = { message };
  if (process.env.NODE_ENV === 'development' && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = {
  notFound,
  errorHandler,
};
