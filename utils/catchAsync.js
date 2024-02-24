// Higher-order function to wrap asynchronous route handlers and middleware
module.exports = (func) => {
  // Return a new function that takes the standard Express.js route handler arguments: req, res, next
  return (req, res, next) => {
    // Call the passed async function and catch any errors
    func(req, res, next).catch(next);
    // The caught error is then passed to the next() function, effectively forwarding it to Express's error handling middleware
  };
};
