const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateOTP, sendEmail } = require('../utils/otpUtils');
const otpModel = require('../models/otpModel');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, phone, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: password, 
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email,name, phone, password } = req.body;

    // Ensure email/phone AND password are provided
    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: "Email/Phone and password are required" });
    }
    if (name) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find user by email or phone
    const user = await User.findOne({ $or: [{ email }, { phone }] });

    // If user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided email matches the user's email
    if (email && user.email !== email) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Respond with user data (excluding sensitive information like password)
    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: password, 
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate and save the OTP
    
    const otp = generateOTP();
    await otpModel.create({ identifier: email, otp });

    // Send OTP via email
    await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and newPassword are required' });
    }

    // Verify OTP
    const otpRecord = await otpModel.findOne({ identifier: email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check OTP expiration
    const currentTime = new Date();
    const otpAge = (currentTime - otpRecord.createdAt) / 1000; // Age in seconds
    if (otpAge > 600) {
      await otpModel.deleteOne({ identifier: email, otp });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Find the user and update the password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete the OTP after successful password reset
    await otpModel.deleteOne({ identifier: email, otp });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
