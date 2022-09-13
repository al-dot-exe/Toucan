const app = require('express');
const router = app.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
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

// @desc  // Process Login Form if not logged in
// @route // POST /login
router.post('/login', ensureGuest, authController.postLogin);

// @desc  // Process logout request if logged in
// @route // POST /logout
router.post('/logout', ensureAuth, authController.postLogout);

module.exports = router;
