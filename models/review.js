// Import mongoose for MongoDB interactions
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for reviews
const reviewSchema = new Schema({
  body: String, // The text content of the review
  rating: Number, // The numerical rating associated with the review
  author: {
    type: Schema.Types.ObjectId, // References a User document in the database
    ref: 'User', // Establishes a reference to the User model
  },
});

// Compile and export the Review model based on the reviewSchema
module.exports = mongoose.model('Review', reviewSchema);
