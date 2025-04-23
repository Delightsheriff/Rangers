const express = require('express');
const connectDb = require('./db/dbController');
const userRouter = require('./router/userRouter');
const app = express();
const err = require('./middleware/errorHandler');
require('dotenv').config();
const port = process.env.PORT;

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', userRouter);

app.use(err);

app.listen(port, console.log(`Server running on port ${port}`));
