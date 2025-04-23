const express = require('express');
const connectDb = require('./db/dbController');
const userRouter = require('./router/userRouter');
const app = express();
const err = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
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

// Routes
app.use('/api', userRouter);

// Error handling middleware
app.use(err);
