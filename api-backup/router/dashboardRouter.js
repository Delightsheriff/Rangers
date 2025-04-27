const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardOverview } = require('../controller/dashboardController');

// Create a new router instance
const dashboardRouter = Router();

// Route to get dashboard overview
dashboardRouter.get('/overview', authMiddleware, getDashboardOverview);

// Export the router to be used in other parts of the application
module.exports = dashboardRouter;
