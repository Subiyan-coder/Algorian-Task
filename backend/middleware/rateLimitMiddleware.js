const { rateLimit } = require('express-rate-limit');
const { StatusCodes } = require('http-status-codes');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      status: StatusCodes.TOO_MANY_REQUESTS,
      message
    }
  });

const loginLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  'Too many login attempts. Please try again after 15 minutes.'
);

const registerLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  'Too many registration attempts. Please try again after 1 hour.'
);

const protectedLimiter = createLimiter(
  15 * 60 * 1000,
  300,
  'Too many requests. Please try again later.'
);

const passwordResetLimiter = createLimiter(
    15 * 60 * 1000,
    3,
    'Too many password reset attempts. Please try again after 15 minutes.'
);

module.exports = {
  loginLimiter,
  registerLimiter,
  protectedLimiter,
  passwordResetLimiter
};