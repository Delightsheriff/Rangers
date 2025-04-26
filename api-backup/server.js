const express = require('express');
const swaggerUi = require('swagger-ui-express');
const connectDb = require('./db/dbController');
const userRouter = require('./router/userRouter');
const groupRouter = require('./router/groupRouter');
const expenseRouter = require('./router/expenseRouter');
const app = express();
const err = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const generateSwaggerSpec = require('./utils/swaggerSetup');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Connect to database
connectDb()
  .then(() => {
    // Start server only after successful database connection
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors()); // Enable CORS for all routes

// Logging Middleware
app.use(morgan('dev')); // HTTP request logger
app.use(requestLogger); // Custom request logger

// Rate Limiting
app.use(apiLimiter); // Apply rate limiting to all routes

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to $plitwise API',
    description: 'A smart expense sharing application',
    version: '1.0.0',
    documentation: '/api',
    status: 'Online',
    serverTime: new Date().toISOString(),
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to $plitwise API endpoints',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        refreshToken: 'POST /api/auth/refresh-token',
      },
      user: {
        getProfile: 'GET /api/users/:id',
        updateProfile: 'PUT /api/users/:id',
        deleteAccount: 'DELETE /api/users/:id',
      },
      password: {
        forgot: 'POST /api/auth/forgot-password',
        reset: 'POST /api/auth/reset-password',
      },
      groups: {
        create: 'POST /api/groups',
        getOne: 'GET /api/groups/:groupId',
        getAll: 'GET /api/groups',
      },
      expenses: {
        create: 'POST /api/expenses',
        getAll: 'GET /api/groups/:groupId/expenses',
        getOne: 'GET /api/expenses/:expenseId',
        update: 'PUT /api/expenses/:expenseId',
        delete: 'DELETE /api/expenses/:expenseId',
      },
      balance: {
        get: 'GET /api/balance',
      },
    },
    serverTime: new Date().toISOString(),
  });
});

// Routes
app.use('/api', userRouter);
app.use('/api', groupRouter);
app.use('/api', expenseRouter);

// Error handling middleware
app.use(err);

const swaggerSpec = generateSwaggerSpec(app, {
  title: 'SplitWise API',
  description: 'Auto-generated API docs',
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
