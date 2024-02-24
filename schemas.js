// Import the base Joi validation library and the sanitize-html module for sanitizing input
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Define an extension for Joi to add a custom validation rule
const extension = (joi) => ({
  type: 'string', // Specify the type of data to validate
  base: joi.string(), // Use Joi's base string validation as the starting point
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!', // Custom error message for HTML content
  },
  rules: {
    escapeHTML: {
      // Define the custom rule 'escapeHTML'
      validate(value, helpers) {
        // Validation function
        // Sanitize the input, removing all HTML tags and attributes
        const clean = sanitizeHtml(value, {
          allowedTags: [], // No HTML tags are allowed
          allowedAttributes: {}, // No HTML attributes are allowed
        });
        // If the sanitized value is different from the original input, it contained HTML
        if (clean !== value) return helpers.error('string.escapeHTML', { value });
        // Return the sanitized string if validation passes
        return clean;
      },
    },
  },
});

// Extend Joi with the custom extension to include the 'escapeHTML' rule
const Joi = BaseJoi.extend(extension);

// Define a schema for validating aquarium data with Joi
module.exports.aquariumSchema = Joi.object({
  aquarium: Joi.object({
    // Define the structure of the aquarium object
    title: Joi.string().required().escapeHTML(), // Title must be a string, required, and free of HTML
    price: Joi.number().required().min(0), // Price must be a number, required, and at least 0
    description: Joi.string().required().escapeHTML(), // Description must be a string, required, and free of HTML
    location: Joi.string().required().escapeHTML(), // Location must be a string, required, and free of HTML
  }).required(),
  deleteImages: Joi.array(), // Define an array for image deletion, no further validation specified here
});

// Define a schema for validating review data with Joi
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    // Define the structure of the review object
    rating: Joi.number().required().min(1).max(5), // Rating must be a number, required, between 1 and 5
    body: Joi.string().required().escapeHTML(), // Body must be a string, required, and free of HTML
  }).required(),
});
