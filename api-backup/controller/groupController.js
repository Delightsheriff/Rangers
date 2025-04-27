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

    // Add group to creator's groups
    await creator.addGroup(group._id);

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
        // Add group to user's groups
        await user.addGroup(group._id);
      } else {
        // User doesn't exist, add to invited users
        invitedUsers.push(member.email);

        // Add to invited users
        await group.inviteUser(member.email);

        // Send invitation email
        try {
          const registrationLink = `${process.env.FRONTEND_URL}/auth/signup`;
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

    // Populate expenses
    await group.populate('expenses');

    // Calculate total amount spent
    const totalAmount = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate user's balance
    const userExpenses = group.expenses.filter((expense) =>
      expense.paidBy.some((payment) => payment.userId.toString() === userId.toString()),
    );

    const userPaid = userExpenses.reduce((sum, expense) => {
      const userPayment = expense.paidBy.find(
        (payment) => payment.userId.toString() === userId.toString(),
      );
      return sum + (userPayment ? userPayment.amountPaid : 0);
    }, 0);

    const userShare = totalAmount / group.members.length;
    const userBalance = userPaid - userShare;

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
        expenses: group.expenses.map((expense) => ({
          id: expense._id,
          name: expense.name,
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          paidBy: expense.paidBy.map((payment) => ({
            userId: payment.userId,
            amountPaid: payment.amountPaid,
            paidAt: payment.paidAt,
          })),
        })),
        totalAmount,
        userBalance,
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

    // Populate expenses for each group
    for (const group of groups) {
      await group.populate('expenses');
    }

    const formattedGroups = groups.map((group) => {
      // Calculate total amount spent
      const totalAmount = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Calculate user's balance
      const userExpenses = group.expenses.filter((expense) =>
        expense.paidBy.some((payment) => payment.userId.toString() === userId.toString()),
      );

      const userPaid = userExpenses.reduce((sum, expense) => {
        const userPayment = expense.paidBy.find(
          (payment) => payment.userId.toString() === userId.toString(),
        );
        return sum + (userPayment ? userPayment.amountPaid : 0);
      }, 0);

      const userShare = totalAmount / group.members.length;
      const userBalance = userPaid - userShare;

      return {
        id: group._id,
        name: group.name,
        description: group.description,
        creator: {
          id: group.creator._id,
          name: `${group.creator.firstName} ${group.creator.lastName}`,
          email: group.creator.email,
        },
        memberCount: group.members.length,
        totalAmount,
        userBalance,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
      };
    });

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

    // Get the user and add all groups to their groups array
    const user = await UserModel.findById(userId);
    if (user) {
      for (const group of groups) {
        await user.addGroup(group._id);
      }
    }

    return groups.length; // Return the number of groups the user was added to
  } catch (error) {
    console.error('Error handling registration invitations:', error);
    return 0;
  }
};

// Add a member to a group
exports.addMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Find the group
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

    // Check if user is already a member
    if (group.isMember(email)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this group',
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (user) {
      // User exists, add to members
      await group.addMember(user._id, user.email);
      // Add group to user's groups
      await user.addGroup(group._id);
    } else {
      // User doesn't exist, add to invited users
      await group.inviteUser(email);

      // Send invitation email
      try {
        const registrationLink = `${process.env.FRONTEND_URL}/auth/signup`;
        await sendEmail(email, 'groupInvitation', [
          group.name,
          req.user.firstName,
          registrationLink,
        ]);
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: user ? 'Member added successfully' : 'Invitation sent successfully',
    });
  } catch (err) {
    next(err);
  }
};

// Leave a group
exports.leaveGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Find the group
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is a member of the group
    const isMember = group.isMember(userEmail);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this group',
      });
    }

    // Check if user is the creator
    if (group.creator.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Group creator cannot leave the group. Please delete the group instead.',
      });
    }

    // Remove member from group
    await group.removeMember(userEmail);

    // Remove group from user's groups
    const user = await UserModel.findById(userId);
    if (user) {
      await user.removeGroup(groupId);
    }

    res.status(200).json({
      success: true,
      message: 'Successfully left the group',
    });
  } catch (err) {
    next(err);
  }
};

// Delete a group
exports.deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Find the group
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user is the creator
    if (group.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the group creator can delete the group',
      });
    }

    // Remove group from all members' groups
    for (const member of group.members) {
      if (member.user) {
        const user = await UserModel.findById(member.user);
        if (user) {
          await user.removeGroup(groupId);
        }
      }
    }

    // Delete the group
    await GroupModel.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
