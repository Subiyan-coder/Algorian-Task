const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return errorResponse(res, 401, 'User account no longer exists', []);
            }

            if (user.changedPasswordAfter(decoded.iat)) {
                return errorResponse(res, 401, 'Password was recently changed. Please log in again', []);
            }

            req.user = user;

            next();
        } catch (error) {
           if (error.name === 'TokenExpiredError') {
                return errorResponse(res, 401, 'Session expired. Please log in again', []);
            }
            return errorResponse(res, 401, 'Invalid token. Please log in again', []);
        }
    } else {
        return errorResponse(res, 401, 'Authentication token is required', []);   
    }
}

module.exports = { protect };