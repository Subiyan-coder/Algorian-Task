const express = require('express');
const { register, login, refreshToken, logout } = require('../../controllers/authController');
const { changePassword, forgotPassword, verifyOtp, resetPassword } = require('../../controllers/passwordController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validateMiddleware');
const { registerRules, loginRules } = require('../../middleware/validationRules');
const { loginLimiter, registerLimiter, passwordResetLimiter } = require('../../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/register', registerLimiter, registerRules, validate, register);
router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/reset-password', resetPassword);

module.exports = router;