const crypto = require('crypto');
const { GroupModel } = require('../model/groupModel');
const { UserModel } = require('../model/userModel');
const { sendEmail } = require('../utils/emailHelper');

// Create a new group
exports.createGroup = async (req, res, next) => {
  try {
    const { groupName, groupDescription, members } = req.body;
    const creatorId = req.user._id;

    // Validate input
    if (!groupName || !members || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: 'Group name and members array are required',
      });
    }

    // Get creator's information
    const creator = await UserModel.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found',
      });
    }

    // Create the group
    const group = await GroupModel.create({
      name: groupName,
      description: groupDescription || '',
      creator: creatorId,
      members: [
        {
          user: creatorId,
          email: creator.email,
          isActive: true,
          joinedAt: new Date(),
        },
      ],
    });

    // Process members
    const existingUsers = [];
    const invitedUsers = [];

    for (const member of members) {
      if (!member.email) continue;

      // Skip if it's the creator
      if (member.email === creator.email) continue;

      // Check if user exists
      const user = await UserModel.findOne({ email: member.email });

      if (user) {
        // User exists, add to members
        existingUsers.push(user);
        await group.addMember(user._id, user.email);
      } else {
        // User doesn't exist, add to invited users
        invitedUsers.push(member.email);

        // Add to invited users
        await group.inviteUser(member.email);

        // Send invitation email
        try {
          const registrationLink = `${process.env.FRONTEND_URL}/auth/register`;
          await sendEmail(member.email, 'groupInvitation', [
            group.name,
            creator.firstName,
            registrationLink,
          ]);
        } catch (emailError) {
          console.error('Failed to send invitation email:', emailError);
          // Continue with group creation even if email fails
        }
      }
    }

    // Save the group with all changes
    await group.save();

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
        creator: {
          id: creator._id,
          name: `${creator.firstName} ${creator.lastName}`,
          email: creator.email,
        },
        members: group.members.map((member) => ({
          email: member.email,
          isActive: member.isActive,
        })),
        invitedUsers: group.invitedUsers.map((invite) => ({
          email: invite.email,
          invitedAt: invite.invitedAt,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get a group by ID
exports.getGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is a member of the group
    const isMember = group.isMember(req.user.email);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group',
      });
    }

    // Populate creator and member information
    await group.populate('creator', 'firstName lastName email');
    await group.populate('members.user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
        creator: {
          id: group.creator._id,
          name: `${group.creator.firstName} ${group.creator.lastName}`,
          email: group.creator.email,
        },
        members: group.members.map((member) => ({
          id: member.user ? member.user._id : null,
          name: member.user ? `${member.user.firstName} ${member.user.lastName}` : null,
          email: member.email,
          isActive: member.isActive,
          joinedAt: member.joinedAt,
        })),
        invitedUsers: group.invitedUsers.map((invite) => ({
          email: invite.email,
          invitedAt: invite.invitedAt,
        })),
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all groups for a user
exports.getUserGroups = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Find groups where user is a member
    const groups = await GroupModel.find({
      'members.email': userEmail,
      'members.isActive': true,
    }).populate('creator', 'firstName lastName email');

    const formattedGroups = groups.map((group) => ({
      id: group._id,
      name: group.name,
      description: group.description,
      creator: {
        id: group.creator._id,
        name: `${group.creator.firstName} ${group.creator.lastName}`,
        email: group.creator.email,
      },
      memberCount: group.members.length,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    }));

    res.status(200).json({
      success: true,
      groups: formattedGroups,
    });
  } catch (err) {
    next(err);
  }
};

// Handle user registration with pending group invitations
exports.handleRegistrationInvitations = async (userId, email) => {
  try {
    // Find all groups where this email is in the invitedUsers array
    const groups = await GroupModel.find({
      'invitedUsers.email': email,
    });

    // For each group, add the user as a member
    for (const group of groups) {
      await group.addMember(userId, email);
    }

    return groups.length; // Return the number of groups the user was added to
  } catch (error) {
    console.error('Error handling registration invitations:', error);
    return 0;
  }
};
