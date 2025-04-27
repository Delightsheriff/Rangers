const ExpenseModel = require('../model/expenseModel');

// Create new Expense
exports.createExpense = async (req, res) => {
  try {
    const { groupId, description, amount, paidBy, paidAt } = req.body;

    // Validate input
    if (!groupId || !description || !amount || !paidBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get group
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const amountToBePaid = amount / group.members.length;


    // Create new expense
    const newExpense = await ExpenseModel.create({
      groupId,
      description,
      amount: amountToBePaid,
      amountPaid: amount,
      paidBy,
      paidAt,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all expenses for a group
exports.getAllExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const expenses = await ExpenseModel.find({ groupId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single expense
exports.getExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await ExpenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json(expense);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
}

// Get all expenses for a user
exports.getUserExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await ExpenseModel.find({ 'paidBy.userId': userId });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
