// Imports and setup for mapbox geocoding and cloudinary
const Aquarium = require('../models/aquarium');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

// Controller to display all aquariums
module.exports.indx = async (req, res) => {
  const aquariums = await Aquarium.find({});
  res.render('aquariums/index', { aquariums });
};

// Controller to render the form for creating a new aquarium
module.exports.renderNewForm = (req, res) => {
  res.render('aquariums/new');
};

// Controller to create a new aquarium with geolocation and images
module.exports.createAquarium = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.aquarium.location,
      limit: 1,
    })
    .send();
  const rawBodyData = JSON.parse(geoData.rawBody);
  const aquarium = new Aquarium(req.body.aquarium);
  aquarium.geometry = rawBodyData.features[0].geometry; // Set the location geometry
  aquarium.images = req.files.map((f) => ({ url: f.path, filename: f.filename })); // Process uploaded images
  aquarium.author = req.user._id; // Set the aquarium author
  await aquarium.save();
  req.flash('success', 'Successfully made a new aquarium!');
  res.redirect(`/aquariums/${aquarium._id}`);
};

// Controller to display a single aquarium by ID with reviews and author populated
module.exports.showAquarium = async (req, res) => {
  const aquarium = await Aquarium.findById(req.params.id).populate('reviews').populate('author');
  if (!aquarium) {
    req.flash('error', 'Aquarium does not exist.');
    return res.redirect('/aquariums');
  }
  res.render('aquariums/show', { aquarium });
};

// Controller to render the edit form for an aquarium
module.exports.renderEditForm = async (req, res) => {
  const aquarium = await Aquarium.findById(req.params.id);
  if (!aquarium) {
    req.flash('error', 'Aquarium does not exist.');
    return res.redirect('/aquariums');
  }
  res.render('aquariums/edit', { aquarium });
};

// Controller to update an aquarium with new data and images
module.exports.updateAquarium = async (req, res) => {
  const { id } = req.params;
  const aquarium = await Aquarium.findByIdAndUpdate(id, req.body.aquarium, { new: true });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  aquarium.images.push(...imgs); // Add new images
  if (req.body.deleteImages) {
    // Delete selected images
    for (const filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await aquarium.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  await aquarium.save();
  req.flash('success', 'Successfully updated aquarium!');
  res.redirect(`/aquariums/${aquarium._id}`);
};

// Controller to delete an aquarium by ID
module.exports.deleteAquarium = async (req, res) => {
  const { id } = req.params;
  await Aquarium.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted aquarium!');
  res.redirect('/aquariums');
};
