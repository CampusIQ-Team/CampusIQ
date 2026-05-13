const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    const host = new URL(process.env.MONGO_URI.replace('mongodb+srv://', 'https://')).hostname;
    console.log(`MongoDB connected: ${host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;