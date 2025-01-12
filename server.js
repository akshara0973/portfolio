const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

// Initialize Express App
const app = express();
app.use(express.static(__dirname)); 
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/portfolio')
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

// Define Mongoose Model
const Users = mongoose.model("data", userSchema);

// Serve HTML Form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle Form Submission
app.post('/post', async (req, res) => {
  try {
    console.log("POST /post request received");
    console.log("Request body:", req.body);

    const { name, email, message } = req.body;
    const user = new Users({
      name,
      email,
      message
    });
    await user.save();
    console.log("User saved:", user);
    res.send("User data saved successfully!");
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).send("Error saving user data!");
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
