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
const path = require('path');
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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Landing page for the api
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
