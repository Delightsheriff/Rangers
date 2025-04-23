const { generateAccessToken, generateRefreshToken } = require('../jwt/tokengenerator');
const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailHelper');

const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    // Send welcome email
    await sendEmail(email, 'welcome', firstName);

    // Return only the user ID and a success message
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
    });
  } catch (error) {
    next({ status: 500, message: 'Something went wrong' });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        msg: 'No existing user found with that email address',
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ msg: 'email address or password incorrect' });
    }

    const { password: _, ...userData } = user.toObject();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in database
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // Send login notification email
    await sendEmail(email, 'login', user.firstName);

    res.status(200).json({
      msg: 'User logged in',
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next({ status: 500, message: 'Something went wrong' });
  }
};

const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Remove the refresh token from the database
    await userModel.updateOne(
      { _id: decoded.id },
      { $pull: { refreshTokens: { token: req.body.refreshToken } } },
    );

    res.status(200).json({ msg: 'User successfully logged out' });
  } catch (error) {
    next({ status: 500, message: 'Something went wrong during logout' });
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the refresh token exists in the database
    const user = await userModel.findOne({
      _id: decoded.id,
      'refreshTokens.token': refreshToken,
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    next({ status: 401, message: 'Invalid refresh token' });
  }
};

const get_a_user = async (req, res, next) => {
  const { id } = req.params;
  try {
    const fetchedUser = await userModel.findById(id);
    if (!fetchedUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ fetchedUser });
  } catch (error) {
    next({ status: 404, message: 'User not found' });
  }
};

const update_a_user = async (req, res, next) => {
  const userInfo = req.user;
  const { id } = req.params;
  const update = req.body;

  if (userInfo._id != id) {
    console.log(userInfo._id, id);
    return res.status(401).json({ msg: 'You are not authorized to perform this action' });
  }

  try {
    // Check if email is being updated
    if (update.email && update.email !== userInfo.email) {
      // Check if the new email already exists
      const existingUser = await userModel.findOne({ email: update.email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    // If password is being updated, hash it
    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }

    const updatedUserDetails = await userModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedUserDetails) {
      return res.status(404).json({ msg: 'No user found' });
    }

    const { password: _, ...userData } = updatedUserDetails.toObject();
    res.status(200).json(userData);
  } catch (error) {
    console.error('Update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    next(error);
  }
};

const delete_a_user = async (req, res, next) => {
  const userInfo = req.user;
  const { id } = req.params;

  if (userInfo._id != id) {
    return res.status(401).json({ msg: 'You are not authorized to perform this action' });
  }

  try {
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ msg: 'User successfully deleted' });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send password reset email
    await sendEmail(email, 'passwordReset', resetLink);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  get_a_user,
  update_a_user,
  delete_a_user,
  forgotPassword,
};
