const { generateAccessToken, generateRefreshToken } = require('./generateToken');
const { successResponse } = require('./apiResponse');

const sendTokenResponse = (user, statusCode, res, message) => {
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(
        res,
        statusCode,
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            contact: user.contact,
            profileImage: user.profileImage,
            accessToken
        },
        message
    );
};

module.exports = sendTokenResponse;