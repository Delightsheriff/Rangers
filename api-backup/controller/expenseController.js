const { ExpenseModel } = require('../model/expenseModel');
const { GroupModel } = require('../model/groupModel');
const { UserModel } = require('../model/userModel');
const { validateRequest } = require('../middleware/validator');
const { sendEmail } = require('../utils/emailHelper');

// Create new Expense
exports.createExpense = async (req, res) => {
  try {
    const { error } = validateRequest(req.body, 'createExpense');
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { groupId, description, amount, paidBy, splits } = req.body;

    // Get the group to validate members
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Validate that all paidBy users are group members
    const groupMemberIds = group.members.map((member) => member.userId.toString());
    const paidByUserIds = paidBy.map((payment) => payment.userId.toString());

    const invalidPaidByUsers = paidByUserIds.filter((userId) => !groupMemberIds.includes(userId));
    if (invalidPaidByUsers.length > 0) {
      return res.status(400).json({
        message: 'Some paying users are not members of the group',
      });
    }

    // Validate that all splits are for group members
    const splitUserIds = splits.map((split) => split.userId.toString());
    const invalidSplitUsers = splitUserIds.filter((userId) => !groupMemberIds.includes(userId));
    if (invalidSplitUsers.length > 0) {
      return res.status(400).json({
        message: 'Some split users are not members of the group',
      });
    }

    // Validate that total splits equal the expense amount
    const totalSplits = splits.reduce((sum, split) => sum + split.amount, 0);
    if (Math.abs(totalSplits - amount) > 0.01) {
      // Using small epsilon for float comparison
      return res.status(400).json({
        message: 'Total splits must equal the expense amount',
      });
    }

    // Create the expense
    const expense = await ExpenseModel.create({
      name: description,
      description,
      amount,
      groupId,
      paidBy,
      splits,
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return res.status(500).json({ message: 'Error creating expense' });
  }
};

// Get all expenses for a group
exports.getAllExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const expenses = await ExpenseModel.find({ groupId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single expense
exports.getExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, paidBy, paidAt } = req.body;

    // Validate input
    if (!description && !amount && !paidBy && !paidAt) {
      return res.status(400).json({ message: 'At least one field is required' });
    }

    // Update expense
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      expenseId,
      { description, amount, paidBy, paidAt },
      { new: true },
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses for a user
exports.getUserExpenses = async (req, res) => {
  try {
    // If userId is provided in params, get expenses for that specific user
    if (req.params.userId) {
      const { userId } = req.params;
      const expenses = await ExpenseModel.find({ 'paidBy.userId': userId })
        .populate('groupId', 'name')
        .populate('paidBy.userId', 'firstName lastName');
      return res.status(200).json(expenses);
    }

    // Otherwise, get all expenses for the authenticated user across all groups
    const userId = req.user._id;

    // First, get all groups the user is a member of
    const userGroups = await GroupModel.find({
      'members.user': userId,
      'members.isActive': true,
    });

    const groupIds = userGroups.map((group) => group._id);

    // Then, get all expenses from these groups
    const expenses = await ExpenseModel.find({
      groupId: { $in: groupIds },
    })
      .populate('groupId', 'name')
      .populate('paidBy.userId', 'firstName lastName');

    // Format the expenses to include user names
    const formattedExpenses = expenses.map((expense) => ({
      ...expense.toObject(),
      paidBy: expense.paidBy.map((payment) => ({
        ...payment,
        userName: payment.userId ? `${payment.userId.firstName} ${payment.userId.lastName}` : null,
      })),
    }));

    res.status(200).json(formattedExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Paid an expense
exports.paidExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { userId, amountPaid } = req.body;

    // Validate input
    if (!userId || !amountPaid) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Update expense
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      expenseId,
      { $push: { paidBy: { userId, amountPaid } } },
      { new: true },
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send payment reminder
exports.sendReminder = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { debtorId } = req.body;

    // Get the expense
    const expense = await ExpenseModel.findById(expenseId)
      .populate('groupId')
      .populate('paidBy.userId', 'firstName lastName email');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Get the debtor's details
    const debtor = await UserModel.findById(debtorId);
    if (!debtor) {
      return res.status(404).json({ message: 'Debtor not found' });
    }

    // Find the creditor (person who paid)
    const creditor = expense.paidBy[0].userId;
    const amount =
      expense.splits.find((split) => split.userId.toString() === debtorId)?.amount || 0;

    // Send reminder email
    try {
      await sendEmail(debtor.email, 'paymentReminder', [
        debtor.firstName,
        `${creditor.firstName} ${creditor.lastName}`,
        amount,
        expense.groupId.name,
      ]);

      return res.status(200).json({ message: 'Reminder sent successfully' });
    } catch (emailError) {
      console.error('Failed to send reminder email:', emailError);
      return res.status(500).json({ message: 'Failed to send reminder email' });
    }
  } catch (error) {
    console.error('Error sending reminder:', error);
    return res.status(500).json({ message: 'Error sending reminder' });
  }
};
