const express = require('express');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const userRoutes = require('./userRoutes');
const profileRoutes = require('./profileRoutes');
const { protectedLimiter } = require('../../middleware/rateLimitMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', protectedLimiter, profileRoutes);
router.use('/tasks', protectedLimiter, taskRoutes);
router.use('/users', protectedLimiter, userRoutes);

module.exports = router;