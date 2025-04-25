const { default: mongoose } = require('mongoose');

module.exports = connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBCONNECTIONSTRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};
