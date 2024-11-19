// hostelhub-backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');



const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB directly
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/hostelhub');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB(); // Call the function to connect to the database

app.use('/api', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
