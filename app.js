const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connection Successful");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Mongoose Schema & Model
const dataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  description: String,
  image: String,
  velocity: String,
  distance: String
});

const Planet = mongoose.model('Planet', dataSchema);

// Routes

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get OS info
app.get('/os', (req, res) => {
  res.json({
    hostname: OS.hostname(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Health checks
app.get('/live', (req, res) => res.json({ status: 'live' }));
app.get('/ready', (req, res) => res.json({ status: 'ready' }));

// Get planet by ID
app.post('/planet', async (req, res) => {
  try {
    const { id } = req.body;

    if (id === undefined || id < 0 || id > 9) {
      return res.status(400).json({ error: "Select a planet ID from 0 to 9" });
    }

    const planetData = await Planet.findOne({ id });
    if (!planetData) {
      return res.status(404).json({ error: "Planet not found" });
    }

    res.json(planetData);
  } catch (err) {
    console.error("Error fetching planet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
