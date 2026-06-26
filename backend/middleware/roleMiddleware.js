const { errorResponse } = require('../utils/apiResponse');

const authorize = (...roles)=> {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return errorResponse(res, 403, 'You do not have permission to access this resource');
        }
        next();
    };
};

module.exports = { authorize};