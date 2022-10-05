const app = require('express');
const router = app.Router();
const multer = require('multer');
const uploads = multer({ dest: './database/uploads/' });
const torrentsController = require('../controllers/torrents.js');
const { ensureSecure } = require("../middleware/secure");
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc  // Show Torrent client dashboard if logged in
// @route // GET /torrents/dashboard
router.get('/', ensureSecure, ensureAuth, torrentsController.getClientDashboard);

// @desc  // Show Torrent client dashboard if logged in
// @route // GET /torrents/dashboard
router.get('/dashboard', ensureSecure, ensureAuth, torrentsController.getClientDashboard);

// @desc  // Show only torrents that are seeding if logged in
// @route // GET /torrents/seeding
router.get('/seeding', ensureSecure, ensureAuth, torrentsController.getSeeding);

// @desc  // Show only torrents that are seeding if logged in
// @route // GET /torrents/seeding
router.get('/leeching', ensureSecure, ensureAuth, torrentsController.getLeeching);

// @desc  // Show Specific Torrent information if logged in
// @route // GET /torrents/:id 
router.get('/:id', ensureSecure, ensureAuth, torrentsController.viewTorrent); // might be issue with reading

// @desc  // Download completed Torrent folders to user machine
// @route // Get /torrents/download/:id
router.get('/download/:id', ensureSecure, ensureAuth, torrentsController.downloadTorrent); // might not be safe method

// @desc  // Upload .torrent to Torrent client
// @route // Post /torrents/file-upload
router.post('/file-upload', ensureSecure, ensureAuth, uploads.single('.torrent'), torrentsController.postTorrent);

// @desc  // Upload magnet:uri's to Torrent client
// @route // Post /torrents/magnet-upload
router.post('/magnet-upload', ensureSecure, ensureAuth, uploads.none(), torrentsController.postTorrent);

// @desc  // Delete TorrentID from database (torrent download will still remain on system)
// @route // Post /torrents/:id
router.delete('/:id', ensureSecure, ensureAuth, torrentsController.deleteTorrent);

module.exports = router;
