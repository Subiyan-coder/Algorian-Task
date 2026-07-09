const successResponse = (res, statusCode, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        status: statusCode,
        message,
        data
    });
};

const errorResponse = (res, statusCode, message, errors = []) => {
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        errors
    });
};

const checkRequiredFields = (requiredFields) => {
    return Object.entries(requiredFields)
        .filter(([, value]) =>
            value === undefined ||
            value === null ||
            value === ''
        )
        .map(([field]) => `${field} is required`);
};

module.exports = { successResponse, errorResponse, checkRequiredFields };