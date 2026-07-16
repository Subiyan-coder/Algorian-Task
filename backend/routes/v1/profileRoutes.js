const express = require('express');
const { getProfile, updateProfile, uploadProfileImage } = require('../../controllers/profileController');
const { protect } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/uploadMiddleware');
const { validate } = require('../../middleware/validateMiddleware');
const { updateProfileRules } = require('../../middleware/validationRules');

const router = express.Router();

router.get('/', protect, getProfile);

router.put(
  '/',
  protect,
  updateProfileRules,
  validate,
  updateProfile
);

router.put(
  '/image',
  protect,
  upload.single('profileImage'),
  uploadProfileImage
);

module.exports = router;