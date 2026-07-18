const jwt = require('jsonwebtoken');


const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE
  });
};

const generateResetToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_RESET_SECRET,
        {
            expiresIn: process.env.JWT_RESET_EXPIRE
        }
    );
};

module.exports = { generateAccessToken, generateRefreshToken, generateResetToken };