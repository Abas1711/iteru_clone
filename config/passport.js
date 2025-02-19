const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel'); // Assuming a User model exists

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Set in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set in .env
      callbackURL: '/api/auth/google/callback', // Redirect URI after authentication
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Create new user if not exists
          const hashedPassword = await bcrypt.hash(profile.id, 10); // Use Google ID as default password

          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: hashedPassword,
          });
        }

        return done(null, user); // Pass the user to Passport
      } catch (error) {
        return done(error, null); // Pass error to Passport
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
