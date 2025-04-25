const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest, schemas } = require('../middleware/validator');
const { createGroup, getGroup, getUserGroups } = require('../controller/groupController');

// Create a new router instance
const groupRouter = Router()
  // Route to create a new group
  .post('/groups', authMiddleware, validateRequest(schemas.createGroup), createGroup)

  // Route to get a specific group
  .get('/groups/:groupId', authMiddleware, getGroup)

  // Route to get all groups for the authenticated user
  .get('/groups', authMiddleware, getUserGroups);

// Export the router to be used in other parts of the application
module.exports = groupRouter;
