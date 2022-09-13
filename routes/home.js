const app = require('express');
const router = app.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth'); // need Sqlite and Passport setup first
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc  // Show Home Page if logged in
// @route // GET /
router.get('/', ensureAuth, homeController.getIndex);

// @desc  // Show Login Page if not logged in
// @route // GET /login
router.get('/login', ensureGuest, authController.getLogin);

// @desc  // Show signup page if not logged in
// @route // GET /login
router.get('/signup', ensureGuest, authController.getSignup)

// @desc  // Process Signup Form
// @route // POST /signup
router.post('/signup', authController.postSignup);

// @desc  // Process Login Form
// @route // POST /login
router.post('/login', authController.postLogin);

// @desc  // Process Login Form
// @route // POST /login
router.post('/logout', authController.postLogout);

module.exports = router;
