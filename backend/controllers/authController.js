const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse, checkRequiredFields } = require('../utils/apiResponse')
const register = async (req, res, next) => {
    try {
        const {name, email, contact, password, role} = req.body;

         
        const missingFields = checkRequiredFields({name, email, contact, password});

        if(missingFields.length > 0) {
            return errorResponse(res, 400, 'Please fill all required fields',missingFeilds)
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return errorResponse( res, 400, 'An account with this EMAIL already exists', ['email is taken'] )
        }
        
        const user = await User.create({
            name,
            email,
            contact,
            password,
            role : role === 'admin' ? 'admin' : 'staff'
        });

        return successResponse( res, 201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role,
            token: generateToken(user._id, user.role)
        }, ' User registered Successfully ');
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            return successResponse( res, 200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                contact: user.contact,
                role: user.role,
                token: generateToken(user._id, user.role)
            }, ' Login Successful ');
        } else {
            return errorResponse(res, 401, 'Invalid EMAIL or PASSWORD' );
        }
    } catch (err) {
        next(err);
    }
};

const getProfile = async (req, res) => {
    return successResponse ( res, 200, req.user, ' Profile fetched Successfully ')
};

module.exports = { register, login, getProfile };