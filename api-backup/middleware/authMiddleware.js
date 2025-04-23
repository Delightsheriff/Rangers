const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifiedToken) {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    const user = await userModel.findById(verifiedToken.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
