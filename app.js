// Conditionally load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Core dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

// Models and utilities
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// Route handlers
const userRoutes = require('./routes/users');
const aquariumRoutes = require('./routes/aquariums');
const reviewRoutes = require('./routes/reviews');

// Database connection
const dbUrl = process.env.DB_URL; /*|| 'mongodb://localhost:27017/yelp-aqua'*/
mongoose.connect(dbUrl, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

// Session configuration
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret,
  },
  touchAfter: 24 * 60 * 60,
});
store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
});
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 604800000,
    maxAge: 604800000,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false })); // Note: Customize CSP as per your needs

// Passport authentication setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// Set local variables middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', userRoutes);
app.use('/aquariums', aquariumRoutes);
app.use('/aquariums/:id/reviews', reviewRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('home');
});

// Catch-all for 404 errors
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

// Server start
app.listen(3000, () => {
  console.log('App is listening on Port 3000!');
});
