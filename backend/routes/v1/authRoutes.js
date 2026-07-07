const express = require('express');
const { register, login, getProfile, refreshToken, logout } = require('../../controllers/authController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validateMiddleware');
const { registerRules, loginRules } = require('../../middleware/validationRules');

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/profile', protect, getProfile);
router.post('/refresh', refreshToken);
router.post('/logout', logout)

module.exports = router;