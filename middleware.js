// Importing schema definitions for validation
const { aquariumSchema, reviewSchema } = require('./schemas');
// Utility class for handling custom errors
const ExpressError = require('./utils/ExpressError');
// Mongoose models for aquariums and reviews
const Aquarium = require('./models/aquarium');
const Review = require('./models/review');

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  // If the user is not authenticated
  if (!req.isAuthenticated()) {
    // Store the URL they are currently trying to access
    req.session.returnTo = req.originalUrl;
    // Flash an error message prompting them to log in
    req.flash('error', 'You must be signed in to create a new aquarium.');
    // Redirect to the login page
    return res.redirect('/login');
  }
  // Proceed to the next middleware if the user is authenticated
  next();
};

// Middleware to store the return URL in session for redirecting after login
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// Middleware to check if the current user is the author of the aquarium
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params; // Extract the aquarium ID from the URL
  const aquarium = await Aquarium.findById(id); // Retrieve the aquarium from the database
  // Check if the aquarium's author matches the current user's ID
  if (!aquarium.author.equals(req.user._id)) {
    // If not, flash an error message
    req.flash('error', "You don't have permission to do that!");
    // Redirect back to the aquarium's page
    return res.redirect(`/aquariums/${id}`);
  }
  // Proceed to the next middleware if the user is the author
  next();
};

// Middleware to check if the current user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // Extract the aquarium and review IDs from the URL
  const review = await Review.findById(reviewId); // Retrieve the review from the database
  // Check if the review's author matches the current user's ID
  if (!review.author.equals(req.user._id)) {
    // If not, flash an error message
    req.flash('error', "You don't have permission to do that!");
    // Redirect back to the aquarium's page
    return res.redirect(`/aquariums/${id}`);
  }
  // Proceed to the next middleware if the user is the author of the review
  next();
};

// Middleware for validating aquarium data against a predefined Joi schema
module.exports.validateAquarium = (req, res, next) => {
  // Perform validation and capture any errors
  const { error } = aquariumSchema.validate(req.body);
  if (error) {
    // Map the Joi error details to a single string message
    const msg = error.details.map((el) => el.message).join(',');
    // Throw a custom ExpressError with the message and a 400 Bad Request status
    throw new ExpressError(msg, 400);
  } else {
    // If validation passes, proceed to the next middleware
    next();
  }
};

// Middleware for validating review data against a predefined Joi schema
module.exports.validateReview = (req, res, next) => {
  // Perform validation and capture any errors
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    // Map the Joi error details to a single string message
    const msg = error.details.map((el) => el.message).join(',');
    // Throw a custom ExpressError with the message and a 400 Bad Request status
    throw new ExpressError(msg, 400);
  } else {
    // If validation passes, proceed to the next middleware
    next();
  }
};
