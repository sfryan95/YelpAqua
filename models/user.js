// Import necessary modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Define User schema with an email field
const UserSchema = new Schema({
  email: {
    type: String, // Define email as a string
    required: true, // Make email a required field
    unique: true, // Ensure email values are unique across documents
  },
});

// Apply the passportLocalMongoose plugin to UserSchema
// This adds username, hash and salt fields to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

// Export the User model for use in the application
module.exports = mongoose.model('User', UserSchema);
