// Import User model for handling user data
const User = require('../models/user');

// Display the registration form to the user
module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

// Process user registration
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body; // Extract user details from request body
    const user = new User({ email, username }); // Create a new User instance
    const registeredUser = await User.register(user, password); // Register the user with provided credentials
    // Log in the user immediately after registration
    req.login(registeredUser, (err) => {
      if (err) return next(err); // Handle login error
      req.flash('success', 'Welcome to YelpAqua!'); // Flash a welcome message
      res.redirect('/aquariums'); // Redirect to the main page after successful registration
    });
  } catch (e) {
    req.flash('error', e.message); // Flash error message if registration fails
    res.redirect('register'); // Redirect back to registration form
  }
};

// Display the login form to the user
module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

// Process user login
module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!'); // Flash a welcome back message
  const redirectUrl = res.locals.returnTo || '/aquariums'; // Determine redirect URL, defaulting to main page
  res.redirect(redirectUrl); // Redirect user after successful login
};

// Process user logout
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err); // Handle logout error
    req.flash('success', 'Goodbye!'); // Flash goodbye message
    res.redirect('/aquariums'); // Redirect to the main page after logout
  });
};
