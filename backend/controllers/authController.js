const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { successResponse, errorResponse, checkRequiredFields } = require('../utils/apiResponse')


const sendTokenResponse = (user, statusCode, res, message) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  });

  return successResponse(res, statusCode, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    contact: user.contact,
    accessToken
  }, message);
};

const register = async (req, res, next) => {
    try {
        const {name, email, contact, password} = req.body;

         
        const missingFields = checkRequiredFields({name, email, contact, password});

        if(missingFields.length > 0) {
            return errorResponse(res, 400, 'Missing required fields',missingFields)
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return errorResponse(res, 409, 'Email already registered', ['Email already exists']);
        }
        
        const user = await User.create({
            name,
            email,
            contact,
            password,
            role : 'staff'
        });

        return sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const missingFields = checkRequiredFields({ email, password });

        if (missingFields.length > 0) {
            return errorResponse(res, 400, 'Missing required fields', missingFields);
        }

        const user = await User.findOne({ email });
        
        if (!user || !(await user.matchPassword(password))) {
            return errorResponse(res, 401, 'Invalid email or password', []);
            }

            return sendTokenResponse(user, 200, res, 'Login successful');
        } catch (err) {
        next(err);
    }
};

const getProfile = async (req, res) => {
    return successResponse(res, 200, req.user, 'Profile fetched successfully');
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return errorResponse(res, 401, 'No refresh token provided', []);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 401, 'User no longer exists', []);
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    return successResponse(res, 200, {
      accessToken: newAccessToken
    }, 'Token refreshed successfully');

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Refresh token expired. Please log in again', []);
    }
    next(err);
  }
};

const logout = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  return successResponse(res, 200, null, 'Logged out successfully');
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 400, 'Please provide current and new password', []);
    }

    const user = await User.findById(req.user._id);

    if (!(await user.matchPassword(currentPassword))) {
      return errorResponse(res, 401, 'Current password is incorrect', []);
    }

    if (currentPassword === newPassword) {
      return errorResponse(res, 400, 'New password must be different from current password', []);
    }

    user.password = newPassword;
    await user.save(); // triggers pre-save hook - hashes password and sets passwordChangedAt

    return sendTokenResponse(user, 200, res, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login, getProfile, refreshToken, logout, changePassword };