const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse, checkRequiredFields } = require('../utils/apiResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');
const { generateAccessToken } = require('../utils/generateToken');
const { logEvent } = require("../utils/loggerHelper");

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

        logEvent({
            type: "auth",
            event: "User Registered",
            user,
            req
        });

        return sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user || !(await user.matchPassword(password))) {

            logEvent({
                type: "auth",
                level: "warn",
                event: "Failed Login",
                req,
                details: {
                    email
                }
            });

            return errorResponse(res, 401, 'Invalid email or password', []);
          }

        logEvent({
            type: "auth",
            event: "User Logged In",
            user,
            req
        });

            return sendTokenResponse(user, 200, res, 'Login successful');
        } catch (err) {
        next(err);
    }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return errorResponse(res, 401, 'Refresh token is required', []);
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 401, 'User no longer exists', []);
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    logEvent({
        type: "auth",
        event: "Access Token Refreshed",
        user,
        req
    });

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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0)
  });

  logEvent({
      type: "auth",
      event: "User Logged Out",
      req
  });

  return successResponse(res, 200, null, 'Logged out successfully');
};

module.exports = { register, login, logout, refreshToken };