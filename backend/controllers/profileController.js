const User = require('../models/user');
const cloudinary = require('../config/cloudinary');
const { StatusCodes } = require('http-status-codes');
const streamifier = require('streamifier');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { logEvent } = require("../utils/loggerHelper");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        'User not found'
      );
    }

    return successResponse(
      res,
      StatusCodes.OK,
      user,
      'Profile fetched successfully'
    );

  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
      
    const { name, contact } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        'User not found'
      );
    }

    user.name = name ?? user.name;
    user.contact = contact ?? user.contact;

    await user.save();

    logEvent({
        type: "app",
        event: "Profile Updated",
        user,
        req,
        details: {
            nameUpdated: name !== undefined,
            contactUpdated: contact !== undefined
        }
    });

    return successResponse(
      res,
      StatusCodes.OK,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        role: user.role,
        profileImage: user.profileImage
      },
      'Profile updated successfully'
    );

  } catch (err) {
    next(err);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        'Please select an image'
      );
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(
        res,
        StatusCodes.NOT_FOUND,
        'User not found'
      );
    }

const result = await new Promise((resolve, reject) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: process.env.CLOUDINARY_FOLDER
    },
    (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }
  );

  streamifier
    .createReadStream(req.file.buffer)
    .pipe(uploadStream);
});

const oldPublicId = user.profileImage?.public_id;

    user.profileImage = {
    public_id: result.public_id,
    url: result.secure_url
    };

    await user.save();

    logEvent({
        type: "app",
        event: "Profile Image Updated",
        user,
        req
    });

    if (oldPublicId) {
    try {
        await cloudinary.uploader.destroy(oldPublicId);
    } catch (error) {
        logEvent({
            type: "app",
            level: "warn",
            event: "Old Profile Image Deletion Failed",
            user,
            req,
            details: {
                publicId: oldPublicId,
                message: error.message
            }
        });
    }
    }

    return successResponse(
    res,
    StatusCodes.OK,
    {
        profileImage: user.profileImage
    },
    'Profile image uploaded successfully'
    );

  } catch (err) {
        next(err);
    }
};

module.exports = { getProfile, updateProfile, uploadProfileImage };