// Importing required modules and models
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const { descriptions } = require('../seeds/seedHelpers');

// Utility functions for generating random values
const getRandomPrice = () => Math.floor(Math.random() * (50 - 15 + 1)) + 15;
const getRandomDescription = () => descriptions[Math.floor(Math.random() * descriptions.length)];

// Defining Image schema with a virtual for thumbnail generation
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200/');
});

// Options to include virtuals in JSON output
const opts = { toJSON: { virtuals: true } };

// Defining the main Aquarium schema
const AquariumSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ['Point'], // Ensures the geometry type is always "Point"
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: {
      type: Number,
      default: getRandomPrice, // Default price through random generation
    },
    description: {
      type: String,
      default: getRandomDescription, // Default description through random selection
    },
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  opts
);

// Virtual for generating popup markup for map display
AquariumSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a href=\"/aquariums/${this.id}\">${this.title}</a></strong><p>${this.description}</p>`;
});

// Middleware for handling related reviews deletion on aquarium deletion
AquariumSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// Exporting the Aquarium model
module.exports = mongoose.model('Aquarium', AquariumSchema);
