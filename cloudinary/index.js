// Require Cloudinary and CloudinaryStorage modules
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variable settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Initialize Cloudinary storage with specific options
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'YelpAqua', // Designate folder where uploaded files will be stored
    allowedFormats: ['jpeg', 'png', 'jpg'], // Specify allowed file formats
  },
});

// Export configured cloudinary and storage for external use
module.exports = {
  cloudinary,
  storage,
};
