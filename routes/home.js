const app = require("express");
const router = app.Router();
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

// @desc  // Show Home Page if logged in
// @route // GET /
router.get("/", ensureAuth, homeController.getIndex);

// @desc  // Show Settings Page if logged in
// @route // GET /settings
router.get("/settings", ensureAuth, homeController.getSettings);

// @desc  // Show Login Page if not logged in
// @route // GET /login
router.get("/login", ensureGuest, authController.getLogin);

// @desc  // Show signup page if not logged in
// @route // GET /login
router.get("/signup", ensureGuest, authController.getSignup);

// @desc  // Process Signup Form
// @route // POST /signup
router.post("/signup", authController.postSignup);

// @desc  // Process Login Form if not logged in
// @route // POST /login
router.post("/login", ensureGuest, authController.postLogin);

// @desc  // Logout of session
// @route // GET /logout
router.get("/logout", ensureAuth, authController.logout);

// Will add these details later
// @desc  // Update Settings if logged in
// @route // PUT /settings-update
router.put("/settings-update", ensureAuth, homeController.updateSettings);

// Will add these details later
// @desc  // Reset Settings if logged in
// @route // PUT /reset-settings
router.put("/reset-settings", ensureAuth, homeController.updateSettings);

// Will add these details later
// @desc  // Delete current user account if logged in
// @route // DELETE /delete-account
router.delete("/delete-account", ensureAuth, homeController.deleteAccount);

module.exports = router;
