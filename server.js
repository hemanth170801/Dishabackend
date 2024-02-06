const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: "GET,POST,OPTIONS",
  preflightContinue: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
})();

// Define MongoDB Schema and Model (for example, User)
const userSchema = new mongoose.Schema({
  name: String,
  phoneNumber: Number,
  dob: String,
  pob: String,
  tob: String,
  photo: {
    data: Buffer,
    contentType: String,
  }
});

const User = mongoose.model('User', userSchema);

// API Routes
app.post('/api/register', async (req, res, next) => {
  try {
    // Validation (example: check if 'tob' is a valid date)
    const dob = new Date(req.body.dob);
    console.log('dob');
    console.log(req.body)
    console.log(dob);
    console.log(dob.getTime())
   if (isNaN(dob.getTime())) {
      throw new Error('Invalid date string for "tob"');
    }
   
   const newUser = new User(req.body);
   
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

app.get('/api/allusers', async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
