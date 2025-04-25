const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest, schemas } = require('../middleware/validator');
const {
  createGroup,
  getGroup,
  getUserGroups,
  addMember,
  leaveGroup,
  deleteGroup,
} = require('../controller/groupController');

// Create a new router instance
const groupRouter = Router()
  // Route to create a new group
  .post('/groups', authMiddleware, validateRequest(schemas.createGroup), createGroup)

  // Route to get a specific group
  .get('/groups/:groupId', authMiddleware, getGroup)

  // Route to get all groups for the authenticated user
  .get('/groups', authMiddleware, getUserGroups)

  // Route to add a member to a group
  .post('/groups/:groupId/members', authMiddleware, validateRequest(schemas.addMember), addMember)

  // Route to leave a group
  .delete('/groups/:groupId/leave', authMiddleware, leaveGroup)

  // Route to delete a group (creator only)
  .delete('/groups/:groupId', authMiddleware, deleteGroup);

// Export the router to be used in other parts of the application
module.exports = groupRouter;
