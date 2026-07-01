const Task = require('../models/Task');
const User = require('../models/user');
const { successResponse, errorResponse, checkRequiredFields } = require('../utils/apiResponse')

const createTask = async (req, res, next) => {
    try {
        const {title, description, assignedTo} = req.body;

        const missingFields = checkRequiredFields({title, description, assignedTo});
        if (missingFields.length > 0) {
            return errorResponse(res, 400, 'Please fill all required fields', missingFields);
        }

        const assignee = await User.findById(assignedTo);
        const expectedRole = req.user.role === 'staff' ? 'admin' : 'staff';

        if (!assignee) {
            return errorResponse(res, 400, `As a ${req.user.role}, you can only assign tasks to ${expectedRole}`);
        }

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
    const { status, sortBy, sortOrder } = req.query;

    const matchFilter = {
      $or: [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ]
    };

    if (status && ['pending', 'in-progress', 'completed', 'unable-to-complete'].includes(status)) {
      matchFilter.status = status;
    }

    const sortOptions = {};
    if (sortBy === 'createdBy') {
      sortOptions['createdBy.name'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'assignedTo') {
      sortOptions['assignedTo.name'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'title') {
      sortOptions.title = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'status') {
      sortOptions.status = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    const pipeline = [
      { $match: matchFilter },

      { $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdByData'
      }},
      { $unwind: '$createdByData' },

      { $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'assignedToData'
      }},
      { $unwind: '$assignedToData' },

      { $addFields: {
        createdBy: {
          _id: '$createdByData._id',
          name: '$createdByData.name',
          email: '$createdByData.email'
        },
        assignedTo: {
          _id: '$assignedToData._id',
          name: '$assignedToData.name',
          email: '$assignedToData.email'
        }
      }},

      { $project: {
        createdByData: 0,
        assignedToData: 0
      }},

      { $sort: sortOptions },
    ];

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Task.aggregate(countPipeline).collation({ locale: 'en', strength: 2 });
    const total = countResult.length > 0 ? countResult[0].total : 0;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const tasks = await Task.aggregate(pipeline).collation({ locale: 'en', strength: 2 });

    return successResponse(res, 200, {
      tasks,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total
    }, 'Tasks fetched successfully');

  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.taskId);

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
        const task = await Task.findById(req.params.taskId);

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