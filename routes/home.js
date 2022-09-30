const app = require('express');
const router = app.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc  // Show Home Page if logged in
// @route // GET /
router.get('/', ensureAuth, homeController.getIndex);

// @desc  // Hiding example page
// @route // GET /
// router.get('/example', ensureAuth, homeController.redirectExample);

// @desc  // Show traversy example page
// @route // GET /
router.get('/traversy', ensureAuth, homeController.getTraversyExample);

// @desc  // Show Settings Page if logged in
// @route // GET /settings
router.get('/settings', ensureAuth, homeController.getSettings);

// @desc  // Show Login Page if not logged in
// @route // GET /login
router.get('/login', ensureGuest, authController.getLogin);

// @desc  // Show signup page if not logged in
// @route // GET /login
router.get('/signup', ensureGuest, authController.getSignup)

// @desc  // Process Signup Form
// @route // POST /signup
router.post('/signup', authController.postSignup);

// @desc  // Process Login Form if not logged in
// @route // POST /login
router.post('/login', ensureGuest, authController.postLogin);

// @desc  // Logout of session
// @route // GET /logout
router.get('/logout', ensureAuth, authController.logout);

// Will add these details later
// // @desc  // Update Settings  if logged in
// // @route // PUT /settings
// router.put('/settings', ensureAuth, homeController.updateSettings);

module.exports = router;
