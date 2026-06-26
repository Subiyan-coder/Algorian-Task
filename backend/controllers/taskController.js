const Task = require('../models/Task');
const User = require('../models/user');
const { successResponse, errorResponse, checkRequiredFiels } = require('../utils/apiResponse')

const createTask = async (req, res, next) => {
    try {
        const {title, description, assignedTo} = req.body;

        const missingFields = checkRequiredFields({title, description, assignedto});
        if (missingFields.length > 0) {
            return errorResponse(res, 400, 'Please fill all required fields', missingFields);
        }

        const assignee = await User.findById(assignedTo);
        if (!assignee) {
            return errorResponse(res, 400, `As a ${req.user.role}, you can only assign tasks to ${expectedRole}`);
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
        return successResponse(res, 201, task, 'Task created successfully')
    } catch (err) {
        next (err);
    }
}

const getTask = async (req, res, next) => {
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

    successResponse(res, 200,{
      tasks,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total
    }, ' Tasks Fetched Successfully');
  } catch (err) {
    next (err)
  }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.taskID);

        if (!task) {
            return errorResponse(res, 403, 'You do not have permission to update this task');
        }

        const isCreator = task.createdBy.toString() === req.user._id.toString();
        const isAssignee = task.assignedTo.toString() === req.user._id.toString();

        if (!isCreator && !isAssignee) {
            return res.status(403).json({ message: 'You do not have permission to update this task' });
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
        successResponse (res, 200, updated, ' Task updated Successfully' );

    } catch (err) {
        next (err);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.taskID);

        if (!task) {
            return errorResponse(res, 404, 'No task found with the provided ID');
        }

        const isCreator = task.createdBy.toString() === req.user._id.toString();

        if (!isCreator) {
            return errorResponse(res, 403, 'Only the creator of this task can delete it');
        }

        await task.deleteOne();
        return successResponse(res, 200, null, 'Task deleted successfully');
    } catch (err) {
        next (err);
    }
};

module.exports = { createTask, getTask, updateTask, deleteTask }; 