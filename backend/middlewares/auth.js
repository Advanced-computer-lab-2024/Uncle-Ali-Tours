// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path if necessary

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Authorization" header
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach user ID to the request

    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
