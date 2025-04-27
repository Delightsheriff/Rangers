const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest, schemas } = require('../middleware/validator');
const {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getUserExpenses,
  paidExpense,
} = require('../controller/expenseController');

// Create a new router instance
const expenseRouter = Router()
  // Route to create a new expense
  .post('/expenses', authMiddleware, validateRequest(schemas.createExpense), createExpense)

  // Route to get all expenses for a specific group
  .get('/groups/:groupId/expenses', authMiddleware, getAllExpenses)

  // Route to get all expenses for a specific group
  .get('/balance', authMiddleware, getUserExpenses)

  // Route to get a specific expense
  .get('/expenses/:expenseId', authMiddleware, getExpense)

  // Route to update an expense
  .put('/expenses/:expenseId', authMiddleware, validateRequest(schemas.updateExpense), updateExpense)

  // Route to pay an expense
  .put('/expenses/:expenseId/paid', authMiddleware, validateRequest(schemas.updateExpense), paidExpense)

  // Route to delete an expense
  .delete('/expenses/:expenseId', authMiddleware, deleteExpense);

// Export the router to be used in other parts of the application
module.exports = expenseRouter;
