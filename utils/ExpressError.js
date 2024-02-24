// Define a custom error class that extends the built-in Error class
class ExpressError extends Error {
  // Constructor function to initialize the new ExpressError
  constructor(message, statusCode) {
    super(); // Call the constructor of the parent Error class
    this.message = message; // Set the error message (inherited from the Error class)
    this.statusCode = statusCode; // Custom property to hold the HTTP status code
  }
}

// Export the ExpressError class so it can be imported and used in other files
module.exports = ExpressError;
