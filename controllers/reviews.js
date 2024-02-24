// Importing required models
const Aquarium = require('../models/aquarium');
const Review = require('../models/review');

// Handling creation of a new review for an aquarium
module.exports.createReview = async (req, res) => {
  const aquarium = await Aquarium.findById(req.params.id); // Find the specified aquarium by ID
  const review = new Review(req.body.review); // Create a new review with form data
  review.author = req.user._id; // Set the review's author to the current user
  aquarium.reviews.push(review); // Add the new review to the aquarium's review array
  await review.save(); // Save the new review to the database
  await aquarium.save(); // Update the aquarium document with the new review
  req.flash('success', 'Created new review!'); // Display success message to user
  res.redirect(`/aquariums/${aquarium._id}`); // Redirect to the aquarium's page
};

// Handling deletion of a review from an aquarium
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params; // Extract aquarium and review IDs from parameters
  await Aquarium.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the review from the aquarium's reviews array
  await Review.findByIdAndDelete(reviewId); // Delete the review document from the database
  req.flash('success', 'Successfully deleted review!'); // Display success message to user
  res.redirect(`/aquariums/${id}`); // Redirect to the aquarium's page
};
