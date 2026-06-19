const Task = require('../models/Task');
const User = require('../models/user');

const createTask = async (req, res) => {
    try {
        const {title, description, assignedTo} = req.body;

        if (!title || !assignedTo) {
            return res.status(400).json({ message: 'Title and assignedTo are required' });
        }

        const assignee = await User.findById(assignedTo);
        if (!assignee) {
            return res.status(404).json({ message: 'Assigned user not found' });
        }

        const expectedRole = req.user.role === 'staff' ? 'admin' : 'staff';

        if (assignee.role !== expectedRole) {
            return res.status(400)
            .json({ message: `As a ${req.user.role}, you can only assign tasks to ${expectedRole}` });
        }

        const task = await Task.create({
            title,
            description,
            assignedTo,
            createdBy: req.user._id
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getTask = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ createdBy: req.user._id }, { assignedTo: req.user._id }]
    };

    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      tasks,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskID);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isCreator = task.createdBy.toString() === req.user._id.toString();
        const isAssignee = task.assignedTo.toString() === req.user._id.toString();

        if (!isCreator && !isAssignee) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (isCreator) {
            task.title = req.body.title ?? task.title;
            task.description = req.body.description ?? task.description;
            task.remarks = req.body.remarks ?? task.remarks;
            task.status = req.body.status ?? task.status;
        } else {
            task.status = req.body.status ?? task.status;
            task.remarks = req.body.remarks ?? task.remarks;
        }

        const updated = await task.save();
        res.json(updated);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskID);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isCreator = task.createdBy.toString() === req.user._id.toString();

        if (!isCreator) {
            return res.status(403).json({ message: 'Only the creator can delete this task' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createTask, getTask, updateTask, deleteTask }; 