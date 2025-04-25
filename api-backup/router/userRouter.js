// Import the Router object from Express
const { Router } = require('express');

// Import controller functions for user authentication and management

// Import rate limiter for auth routes
const { authLimiter } = require('../middleware/rateLimiter');

// Import validation middleware and schemas
const { validateRequest, schemas } = require('../middleware/validator');

// Import auth middleware
const authMiddleware = require('../middleware/authMiddleware');
const {
  register,
  login,
  refreshToken,
  logout,
  resetPassword,
  forgotPassword,
  getUser,
  updateUser,
} = require('../controller/userController');

// Create a new router instance
const authRouter = Router()
  // Route to handle user registration
  .post('/auth/register', authLimiter, validateRequest(schemas.register), register)

  // Route to handle user login
  .post('/auth/login', authLimiter, validateRequest(schemas.login), login)

  // Route to handle user logout
  .post('/auth/logout', authMiddleware, logout)

  // Route to refresh access token
  .post('/auth/refresh-token', validateRequest(schemas.refreshToken), refreshToken)

  // Route to update a user's information by ID
  .put('/auth/update/:id', authMiddleware, validateRequest(schemas.updateUser), updateUser)

  // Route to retrieve a single user's information by ID
  .get('/auth/user/:id', authMiddleware, getUser)

  // Route to handle forgot password
  .post(
    '/auth/forgot-password',
    authLimiter,
    validateRequest(schemas.forgotPassword),
    forgotPassword,
  )

  // Route to handle password reset
  .post('/auth/reset-password', authLimiter, validateRequest(schemas.resetPassword), resetPassword);

// Export the router to be used in other parts of the application
module.exports = authRouter;
