const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });

const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

const createResponse = (user, tokens) => ({
  success: true,
  message: 'OK',
  user,
  ...tokens,
});

module.exports = {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  createResponse,
};
