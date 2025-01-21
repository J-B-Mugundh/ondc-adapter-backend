require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {;
    await mongoose.connect("mongodb+srv://mugundhjb:mugundh123@cluster0.ok3tu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;