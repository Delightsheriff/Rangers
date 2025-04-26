const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        email: {
          type: String,
          required: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    invitedUsers: [
      {
        email: {
          type: String,
          required: true,
        },
        invitedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Method to add a member to the group
GroupSchema.methods.addMember = async function (userId, email) {
  // Check if user is already a member
  const existingMember = this.members.find((member) => member.email === email);
  if (existingMember) {
    return false;
  }

  // Add the member
  this.members.push({
    user: userId,
    email: email,
    isActive: true,
    joinedAt: new Date(),
  });

  // Remove from invited users if they were invited
  this.invitedUsers = this.invitedUsers.filter((invite) => invite.email !== email);

  return this.save();
};

// Method to invite a user to the group
GroupSchema.methods.inviteUser = async function (email) {
  // Check if user is already a member
  const existingMember = this.members.find((member) => member.email === email);
  if (existingMember) {
    return false;
  }

  // Check if user is already invited
  const existingInvite = this.invitedUsers.find((invite) => invite.email === email);
  if (existingInvite) {
    return false;
  }

  // Add the invitation
  this.invitedUsers.push({
    email: email,
    invitedAt: new Date(),
  });

  return this.save();
};

// Method to remove a member from the group
GroupSchema.methods.removeMember = async function (email) {
  this.members = this.members.filter((member) => member.email !== email);
  return this.save();
};

// Method to check if a user is a member of the group
GroupSchema.methods.isMember = function (email) {
  return this.members.some((member) => member.email === email && member.isActive);
};

// Method to check if a user is invited to the group
GroupSchema.methods.isInvited = function (email) {
  return this.invitedUsers.some((invite) => invite.email === email);
};

const GroupModel = mongoose.model('Group', GroupSchema);

module.exports = {
  GroupModel,
};
