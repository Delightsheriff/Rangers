const { GroupModel } = require('../model/groupModel');
const { ExpenseModel } = require('../model/expenseModel');
const { UserModel } = require('../model/userModel');

// Get dashboard overview data
exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    const userEmail = req.user.email;

    // Find groups where user is a member
    const groups = await GroupModel.find({
      'members.email': userEmail,
      'members.isActive': true,
    }).populate('creator', 'firstName lastName email');

    // Get total number of groups
    const totalGroups = groups.length;

    // Get total number of members across all groups
    const totalMembers = groups.reduce((sum, group) => sum + group.members.length, 0);

    // Get total expenses across all groups
    const totalExpenses = await ExpenseModel.aggregate([
      {
        $match: {
          groupId: { $in: groups.map((group) => group._id) },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalAmount = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

    // Get recent expenses
    const recentExpenses = await ExpenseModel.find({
      groupId: { $in: groups.map((group) => group._id) },
    })
      .sort({ date: -1 })
      .limit(5)
      .populate('groupId', 'name');

    // Get user's balance across all groups
    let userBalance = 0;
    for (const group of groups) {
      // Get all expenses for this group
      const groupExpenses = await ExpenseModel.find({ groupId: group._id });

      // Calculate total amount spent in this group
      const groupTotal = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      // Calculate user's share
      const activeMembersCount = group.members.filter((member) => member.isActive).length;
      const userShare = groupTotal / activeMembersCount;

      // Calculate how much the user has paid in this group
      const userPaid = groupExpenses.reduce((sum, expense) => {
        const userPayment = expense.paidBy.find(
          (payment) => payment.userId.toString() === userId.toString(),
        );
        return sum + (userPayment ? userPayment.amountPaid : 0);
      }, 0);

      // Add to total balance
      userBalance += userPaid - userShare;
    }

    // Get pending invitations
    const pendingInvitations = await GroupModel.find({
      'invitedUsers.email': userEmail,
    }).select('name creator');

    res.status(200).json({
      success: true,
      data: {
        totalGroups,
        totalMembers,
        totalAmount,
        userBalance,
        recentExpenses,
        pendingInvitations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
