const express = require('express');
const { getUsersByRole } = require('../../controllers/userController');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUsersByRole);

module.exports = router;