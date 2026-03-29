const jwt = require('jsonwebtoken');

// Generate a JWT token
// Uses JWT_SECRET from .env, expires in 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
