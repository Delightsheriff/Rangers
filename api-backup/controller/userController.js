// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  generateAccessToken,
  generateRefreshToken,
  createResponse,
  hashToken,
} = require('../jwt/tokengenerator');
const { UserModel } = require('../model/userModel');
const { sendEmail } = require('../utils/emailHelper');
const { handleRegistrationInvitations } = require('./groupController');

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Add input validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ firstName, lastName, email, password: hashedPassword });

    await user.save();

    // Check for pending group invitations and add user to those groups
    const groupsJoined = await handleRegistrationInvitations(user._id, email);

    // Send welcome email
    try {
      await sendEmail(email, 'welcome', firstName);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON(),
      groupsJoined: groupsJoined > 0 ? `Added to ${groupsJoined} group(s)` : null,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id);
    const rawRefreshToken = generateRefreshToken();

    // Add new refresh token to array (matching schema)
    user.refreshTokens.push({
      token: hashToken(rawRefreshToken),
      createdAt: new Date(),
    });

    // Cleanup old tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
    }

    await user.save();

    // Send login notification email
    try {
      await sendEmail(user.email, 'login', user.firstName);
    } catch (emailError) {
      console.error('Login notification email failed:', emailError);
      // Don't fail login if email fails
    }

    res.status(200).json(
      createResponse(user, {
        accessToken,
        refreshToken: rawRefreshToken,
      }),
    );
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Missing token' });
    }

    const hashedToken = hashToken(refreshToken);

    // Fix: Update query to use correct field name
    const user = await UserModel.findOne({
      'refreshTokens.token': hashedToken,
    });

    if (!user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find the specific token
    const tokenDoc = user.refreshTokens.find((t) => t.token === hashedToken);
    if (!tokenDoc) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Check if token is expired (7 days)
    if (Date.now() - tokenDoc.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000) {
      // Remove expired token
      user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashedToken);
      await user.save();
      return res.status(403).json({ message: 'Token expired' });
    }

    // Generate new tokens
    const newRefreshToken = generateRefreshToken();

    // Remove old token and add new one
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashedToken);
    user.refreshTokens.push({
      token: hashToken(newRefreshToken),
      createdAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      accessToken: generateAccessToken(user._id),
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.refreshTokens = null;
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json(user.toJSON());
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    const update = req.body;
    if (update.email && update.email !== req.user.email) {
      const existing = await UserModel.findOne({ email: update.email });
      if (existing && existing._id.toString() !== id)
        return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    if (update.password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    }

    const updated = await UserModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({
      message: 'User Updated Successfully',
      updated,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() !== id)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    const deleted = await UserModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail(email, 'passwordReset', resetLink);
      res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res
        .status(500)
        .json({ success: false, message: 'Failed to send password reset email' });
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    try {
      await sendEmail(user.email, 'login', user.firstName); // Reuse login template for password change notification
      res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (emailError) {
      console.error('Password change notification email failed:', emailError);
      // Don't fail password reset if email fails
      res.status(200).json({ success: true, message: 'Password reset successful' });
    }
  } catch (err) {
    next(err);
  }
};
