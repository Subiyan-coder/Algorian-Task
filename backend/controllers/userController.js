const user = require('../models/user');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getUsersByRole = async (req, res, next) => {
    try {
        const { role } = req.query;
        
        if (!role || !['admin', 'staff'].includes(role)) {
            return errorResponse(res, 400, 'Role must be either admin or staff');
        }
        const users = await user.find({ role }).select('name email contact');
        return successResponse(res, 200, users, 'Users fetched successfully');

    } catch (err) {
        next(err);
    }
};

module.exports = { getUsersByRole };