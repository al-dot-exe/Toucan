const app = require('express');
const router = app.Router();
const torrentsController = require('../controllers/torrents.js');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc  // Show Torrent client dashboard if logged in
// @route // GET /torrents/dashboard
router.get('/dashboard', ensureAuth, torrentsController.getClientDashboard);

module.exports = router;