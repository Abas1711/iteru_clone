const mongoose = require('mongoose');

// Define OTP Schema
const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // Email or Phone
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // TTL Index (5 minutes)
});

// Create the Model
module.exports = mongoose.model('OTP', otpSchema);
