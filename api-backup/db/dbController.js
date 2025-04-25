const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBCONNECTIONSTRING, {
      family: 4,
      retryWrites: true,
      w: 'majority',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
