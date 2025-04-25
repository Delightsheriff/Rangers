const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const createFreshToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  return accessToken;
};

module.exports = { generateTokens, verifyToken, createFreshToken };
