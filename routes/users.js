// Import required modules
const express = require('express');
const router = express.Router();
const passport = require('passport'); // Import Passport for authentication
const catchAsync = require('../utils/catchAsync'); // Utility for handling exceptions in async middleware
const { storeReturnTo } = require('../middleware'); // Custom middleware to store the returnTo path in session
const users = require('../controllers/users'); // Controller for user-related operations

// Route for user registration
router
  .route('/register')
  .get(users.renderRegister) // Display the registration form
  .post(catchAsync(users.register)); // Process the registration

// Route for user login
router
  .route('/login')
  .get(users.renderLogin) // Display the login form
  .post(
    storeReturnTo, // Store the URL to return to after login if specified
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), // Authenticate user
    users.login // Handle login logic
  );

// Route for user logout
router.get('/logout', users.logout); // Process user logout

// Export the router for use in the app
module.exports = router;
