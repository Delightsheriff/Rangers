// Import the Router object from Express
const { Router } = require('express');

// Import controller functions for user authentication and management
const {
  register,
  login,
  logout,
  refreshToken,
  update_a_user,
  delete_a_user,
  get_a_user,
} = require('../controller/userController');

// Import rate limiter for auth routes
const { authLimiter } = require('../middleware/rateLimiter');

// Import validation middleware and schemas
const { validateRequest, schemas } = require('../middleware/validator');

// Create a new router instance
const authRouter = Router()
  // Route to handle user registration
  .post('/auth/register', authLimiter, validateRequest(schemas.register), register)

  // Route to handle user login
  .post('/auth/login', authLimiter, validateRequest(schemas.login), login)

  // Route to handle user logout
  .post('/auth/logout', logout)

  // Route to refresh access token
  .post('/auth/refresh-token', authLimiter, validateRequest(schemas.refreshToken), refreshToken)

  // Route to update a user's information by ID
  .put('/auth/update/:id', validateRequest(schemas.updateUser), update_a_user)

  // Route to delete a user by ID
  .delete('/auth/delete/:id', delete_a_user)

  // Route to retrieve a single user's information by ID
  .get('/auth/user/:id', get_a_user);

// Export the router to be used in other parts of the application
module.exports = authRouter;
