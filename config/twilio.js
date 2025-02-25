const twilio = require('twilio');

// Load environment variables for Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from Twilio Console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from Twilio Console
const phoneTwilio = process.env.TWILIO_PHONE; // Optional: Messaging Service SID

// Initialize Twilio Client
const client = twilio(accountSid, authToken);

// Export the client and optionally the messagingServiceSid
module.exports = {
  client,
  phoneTwilio,
};
