// Import required modules and middleware
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateAquarium } = require('../middleware');
const aquariums = require('../controllers/aquariums');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Define routes for aquarium operations
// Base route for listing aquariums and creating a new aquarium
router
  .route('/')
  .get(catchAsync(aquariums.indx)) // Display all aquariums
  .post(isLoggedIn, upload.array('image'), validateAquarium, catchAsync(aquariums.createAquarium)); // Handle new aquarium creation

// Route to display the form for adding a new aquarium
router.get('/new', isLoggedIn, aquariums.renderNewForm);

// Routes for specific aquarium by ID
router
  .route('/:id')
  .get(catchAsync(aquariums.showAquarium)) // Display a single aquarium details
  .put(isLoggedIn, isAuthor, upload.array('image'), validateAquarium, catchAsync(aquariums.updateAquarium)) // Handle aquarium update
  .delete(isLoggedIn, isAuthor, catchAsync(aquariums.deleteAquarium)); // Handle aquarium deletion

// Route to display the form for editing an existing aquarium
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(aquariums.renderEditForm));

// Export the router for use in the application
module.exports = router;
