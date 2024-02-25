// Conditionally load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Core dependencies for Express application
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

// Import necessary modules for seeding
const Aquarium = require('../models/aquarium'); // Adjust the path as necessary
const citiesArr = require('./seeds/cities'); // Adjust the path as necessary
const { descriptions } = require('./seeds/seedHelpers'); // Adjust the path as necessary

// Database connection
const dbUrl = process.env.DB_URL; // Use MongoDB Atlas connection string from environment variable

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
      author: '65d63cb802303258b9925267', // Ensure this is a valid ObjectId from your Atlas database
      title: `${citiesArr[i].aquarium} Aquarium`,
      images: [
        {
          url: 'https://res.cloudinary.com/dy73d309d/image/upload/v1708636962/YelpAqua/wcazfhafeaubic6xsvf5.jpg',
          filename: 'YelpAqua/wcazfhafeaubic6xsvf5',
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
