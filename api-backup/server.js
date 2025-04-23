const express = require('express');
const connectDb = require('./db/dbController');
const userRouter = require('./router/userRouter');
const app = express();
const err = require('./middleware/errorHandler');
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRouter);

// Error handling middleware
app.use(err);
