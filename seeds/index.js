// Conditionally load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const mongoose = require('mongoose');

// Import necessary modules for seeding
const Aquarium = require('../models/aquarium'); // Path adjusted for index.js in the seeds directory
const citiesArr = require('./cities'); // Since cities.js is in the same directory as index.js
const { descriptions } = require('./seedHelpers'); // Since seedHelpers.js is also in the same directory as index.js

// Database connection
const dbUrl = process.env.DB_URL; /*|| 'mongodb://localhost:27017/yelp-aqua'*/

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Additional options if needed:
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// Helper function to pick a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Function to seed the database
const seedDB = async () => {
  await Aquarium.deleteMany({});
  for (let i = 0; i < citiesArr.length; i++) {
    const ticketPrice = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
    const aquarium = new Aquarium({
      author: '65da5ee107f20466378e1aab', // Ensure this is a valid ObjectId from your Atlas database
      title: `${citiesArr[i].aquarium} Aquarium`,
      images: [
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636962/YelpAqua/wcazfhafeaubic6xsvf5.jpg',
          filename: 'YelpAqua/wcazfhafeaubic6xsvf5',
        },
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636963/YelpAqua/dttxbwegygct6ewflrmm.jpg',
          filename: 'YelpAqua/dttxbwegygct6ewflrmm',
        },
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636964/YelpAqua/q4rgblwwdr9x2gjwqdyz.jpg',
          filename: 'YelpAqua/q4rgblwwdr9x2gjwqdyz',
        },
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636965/YelpAqua/sskyot24g1aruhzrkavb.jpg',
          filename: 'YelpAqua/sskyot24g1aruhzrkavb',
        },
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636965/YelpAqua/wlcgvyknwvhclieafaem.jpg',
          filename: 'YelpAqua/wlcgvyknwvhclieafaem',
        },
      ],
      price: ticketPrice,
      description: sample(descriptions),
      location: `${citiesArr[i].city}, ${citiesArr[i].state}`,
      geometry: {
        type: 'Point',
        coordinates: [citiesArr[i].longitude, citiesArr[i].latitude],
      },
    });
    await aquarium.save();
  }
  console.log('Database seeded!');
};

// Only seed the database if running this script directly
if (require.main === module) {
  seedDB().then(() => {
    mongoose.connection.close();
  });
}
