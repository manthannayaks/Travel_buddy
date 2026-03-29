// backend/config/db.js
// Handles MongoDB connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the database using the URI in .env file
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
