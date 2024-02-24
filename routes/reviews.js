// Import necessary modules and middleware
const express = require('express');
// Create a new router object, enabling parameter merging for nested routes
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

// Route to handle creation of new reviews, ensuring user is logged in and review is valid
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Route to handle deletion of a review, ensuring user is logged in and is the author of the review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// Export the router to make it available for use in the application
module.exports = router;
