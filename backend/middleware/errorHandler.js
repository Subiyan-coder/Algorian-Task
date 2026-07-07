const { errorResponse } = require('../utils/apiResponse');

const errorHandlers = {
  ValidationError: (err, res) => {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, 400, 'Validation failed', errors);
  },

  CastError: (err, res) => {
    return errorResponse(res, 400, `Invalid ${err.path}: ${err.value}`, []);
  },

  JsonWebTokenError: (err, res) => {
    return errorResponse(res, 401, 'Invalid token. Please log in again', []);
  },

  TokenExpiredError: (err, res) => {
    return errorResponse(res, 401, 'Session expired. Please log in again', []);
  }
};

const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue)[0];
  return errorResponse(res, 409, 'Duplicate value', [`${field} already exists`]);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.code === 11000) {
    return handleDuplicateKeyError(err, res);
  }

  const handler = errorHandlers[err.name];
  if (handler) {
    return handler(err, res);
  }

  return errorResponse(
    res,
    err.statusCode || 500,
    'An unexpected error occurred. Please try again.',
    []
  );
};

module.exports = globalErrorHandler;