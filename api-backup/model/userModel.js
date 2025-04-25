// MODEL (userModel.js)

const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' },
});

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2 },
    lastName: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: { type: String, required: true, minlength: 6 },
    refreshTokens: [RefreshTokenSchema],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  delete obj.__v;
  return obj;
};

UserSchema.methods.cleanupRefreshTokens = async function () {
  const now = Date.now();
  this.refreshTokens = this.refreshTokens
    .filter((t) => t.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000 > now)
    .slice(-5);
  return this.save();
};

// Method to add a group to the user's groups
UserSchema.methods.addGroup = async function (groupId) {
  if (!this.groups.includes(groupId)) {
    this.groups.push(groupId);
    return this.save();
  }
  return this;
};

// Method to remove a group from the user's groups
UserSchema.methods.removeGroup = async function (groupId) {
  this.groups = this.groups.filter((id) => id.toString() !== groupId.toString());
  return this.save();
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
  UserModel,
};
