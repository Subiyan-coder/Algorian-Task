const express = require('express');
const { createTask, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { createTaskRules, updateTaskRules } = require('../middleware/validationRules');

const router = express.Router();

router.route('/')
  .get(protect, getTask)
  .post(protect, createTaskRules, validate, createTask);

router.route('/:taskId')
  .put(protect, updateTaskRules, validate, updateTask)
  .delete(protect, deleteTask);

module.exports = router;