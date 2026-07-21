const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { generateResetToken } = require('../utils/generateToken');
const { generateOtp, hashOtp } = require('../utils/otp');
const sendEmail = require('../utils/sendEmail');
const sendTokenResponse = require('../utils/sendTokenResponse');
const { logEvent } = require("../utils/loggerHelper");

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

    const isSamePassword = await user.matchPassword(newPassword);

    if (isSamePassword) {
        return errorResponse(
            res,
            400,
            'New password must be different from current password',
            []
        );
    }

    user.password = newPassword;
    await user.save(); 

    logEvent({
        type: "auth",
        event: "Password Changed",
        user,
        req
    });

    return sendTokenResponse(user, 200, res, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {

    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return successResponse(
                res,
                StatusCodes.OK,
                null,
                'If the email exists, an OTP has been sent.'
            );
        }

        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);

        user.passwordResetOtp = hashedOtp;
        user.passwordResetOtpExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendEmail(
            user.email,
            'Password Reset OTP',
            `
                <h2>Password Reset</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP expires in 5 minutes.</p>
            `
        );

        logEvent({
            type: "auth",
            event: "Password Reset OTP Sent",
            user,
            req
        });

        return successResponse(
            res,
            StatusCodes.OK,
            null,
            'If the email exists, an OTP has been sent.'
        );

    } catch (err) {
        next(err);
    }
};

const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                'Invalid OTP'
            );
        }

        const hashedOtp = hashOtp(otp);

        if (
            user.passwordResetOtp !== hashedOtp ||
            !user.passwordResetOtpExpires ||
            user.passwordResetOtpExpires < Date.now()
        ) {
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                'Invalid or expired OTP'
            );
        }

        user.passwordResetOtp = '';
        user.passwordResetOtpExpires = null;

        await user.save();

        logEvent({
            type: "auth",
            event: "Password Reset OTP Verified",
            user,
            req
        });

        const resetToken = generateResetToken(user._id);

        return successResponse(
            res,
            StatusCodes.OK,
            { resetToken },
            'OTP verified successfully'
        );


    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return errorResponse(
                res,
                StatusCodes.UNAUTHORIZED,
                'Reset token expired'
            );
        }

        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        const decoded = jwt.verify( resetToken, process.env.JWT_RESET_SECRET );

        const user = await User.findById(decoded.id);

        if (!user) {
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                'Unable to reset password'
            );
        }

        const isSamePassword = await user.matchPassword(newPassword);

        if (isSamePassword) {
            return errorResponse(
                res,
                StatusCodes.BAD_REQUEST,
                'New password cannot be the same as the current password.'
            );
        }

        user.password = newPassword;

        await user.save();

        logEvent({
            type: "auth",
            event: "Password Reset Completed",
            user,
            req
        });

        return successResponse(
            res,
            StatusCodes.OK,
            null,
            'Password reset successfully'
        );

    } catch (err) {
          if (err.name === 'TokenExpiredError') {
              return errorResponse(
                  res,
                  StatusCodes.UNAUTHORIZED,
                  'Reset token expired'
              );
          }

          next(err);
        }
};

module.exports = { changePassword, forgotPassword, verifyOtp, resetPassword };