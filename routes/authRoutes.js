const express = require('express');
const { registerUser, loginUser, forgetPassword, resetPassword } = require('../controllers/authController');
const passport =require('../config/passport');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forget-password', forgetPassword); // Generate and send OTP via email or phone
router.patch('/reset-password', resetPassword);  // Reset password after OTP verification
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
const jwt = require('jsonwebtoken');

router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      // Process the authenticated user
      const user = req.user;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ message: 'Login successful', token });
    }
  );
  
// Additional routes for OTP, Google OAuth, etc.

module.exports = router;
