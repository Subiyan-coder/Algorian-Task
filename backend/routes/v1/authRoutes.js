const express = require('express');
const { register, login, getProfile } = require('../../controllers/authController');
const { protect } = require('../../middleware/authMiddleware');
const { validate } = require('../../middleware/validateMiddleware');
const { registerRules, loginRules } = require('../../middleware/validationRules');

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/profile', protect, getProfile);

module.exports = router;