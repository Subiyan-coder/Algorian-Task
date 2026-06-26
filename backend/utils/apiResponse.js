const successResponse = ( res, statusCode, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        success : true,
        status : statusCode,
        message,
        data
    });
};

const errorResponse = ( res, statusCode, message, errors = []) => {
    return res.status(statusCode).json({
        success : false,
        status : statusCode,
        message,
        errors
    });
};

const checkRequiredFiels = (requiredFields) => {
    return Object.keys(requiredFields)
    .filter(field => requiredFields(field))
    .map(field = `${field} is required`);
};

module.exports = { successResponse, errorResponse, checkRequiredFiels };