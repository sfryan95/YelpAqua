// Conditionally load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// Import necessary modules
const mongoose = require('mongoose');
const Aquarium = require('../models/aquarium'); // Import the Aquarium model
const citiesArr = require('./cities'); // Import array of cities with geolocation data
const { descriptions } = require('./seedHelpers'); // Import descriptions helper

// Database connection
const dbUrl = process.env.DB_URL; /*|| 'mongodb://localhost:27017/yelp-aqua'*/
console.log(dbUrl);
// Connect to the MongoDB database
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// Handle connection errors
db.on('error', console.error.bind(console, 'connection error:'));
// Log success message once connected
db.once('open', () => {
  console.log('Database connected');
});

// Helper function to pick a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Function to seed the database
const seedDB = async () => {
  await Aquarium.deleteMany({}); // Delete all existing documents in the Aquarium collection
  // Loop through each city in the cities array
  for (let i = 0; i < citiesArr.length; i += 1) {
    const ticketPrice = Math.floor(Math.random() * (50 - 15 + 1)) + 15; // Generate a random ticket price
    // Create a new Aquarium document for each city
    const aquarium = new Aquarium({
      author: '65d63cb802303258b9925267', // Dummy author ID
      title: citiesArr[i].aquarium, // Aquarium name from cities array
      images: [
        // Array of sample images
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636962/YelpAqua/wcazfhafeaubic6xsvf5.jpg',
          filename: 'YelpAqua/wcazfhafeaubic6xsvf5',
        },
        // Additional images omitted for brevity
      ],
      price: ticketPrice, // Randomly generated ticket price
      description: `${sample(descriptions)}`, // Random description from seedHelpers
      location: `${citiesArr[i].city}, ${citiesArr[i].state}`, // City and state from cities array
      geometry: {
        // Geolocation coordinates
        type: 'Point',
        coordinates: [citiesArr[i].longitude, citiesArr[i].latitude],
      },
    });
    await aquarium.save(); // Save the document to the database
  }
};

// Execute the seedDB function to start the seeding process
seedDB().then(() => {
  mongoose.connection.close(); // Close the database connection once seeding is complete
});
