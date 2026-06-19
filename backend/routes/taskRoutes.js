const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createTask, getTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.route('/')
    .post(protect, createTask)
    .get(protect, getTask);

router.route('/:taskID')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;