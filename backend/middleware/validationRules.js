const { body } = require('express-validator');

const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name must not contain special characters or numbers'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('contact')
    .trim()
    .notEmpty().withMessage('Contact number is required')
    .matches(/^[0-9]{10}$/).withMessage('Contact must be a valid 10-digit number')
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Title must not contain special characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('assignedTo')
    .notEmpty().withMessage('AssignedTo is required')
    .isMongoId().withMessage('AssignedTo must be a valid user ID')
];

const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Title must not contain special characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'unable-to-complete'])
    .withMessage('Status must be one of: pending, in-progress, completed, unable-to-complete'),

  body('remarks')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Remarks cannot exceed 300 characters')
];

module.exports = { registerRules, loginRules, createTaskRules, updateTaskRules };