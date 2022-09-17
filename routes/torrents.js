const app = require('express');
const router = app.Router();
const torrentsController = require('../controllers/torrents.js');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const multer = require('multer');
const uploads = multer({ dest: './database/uploads/' });

// @desc  // Show Torrent client dashboard if logged in
// @route // GET /torrents/dashboard
router.get('/', ensureAuth, torrentsController.getClientDashboard);

// @desc  // Show Torrent client dashboard if logged in
// @route // GET /torrents/dashboard
router.get('/dashboard', ensureAuth, torrentsController.getClientDashboard);

// @desc  // Show only torrents that are seeding if logged in
// @route // GET /torrents/seeding
router.get('/seeding', ensureAuth, torrentsController.getSeeding);

// @desc  // Show only torrents that are seeding if logged in
// @route // GET /torrents/seeding
router.get('/leeching', ensureAuth, torrentsController.getLeeching);

// @desc  // Upload .torrent to Torrent client
// @route // Post /torrents/file-upload
router.post('/file-upload', ensureAuth, uploads.single('.torrent'), torrentsController.postTorrent);

// @desc  // Upload magnet:uri's to Torrent client
// @route // Post /torrents/magnet-upload
router.post('/magnet-upload', ensureAuth, uploads.none(), torrentsController.postTorrent);


// @desc  // Show Specific Torrent information if logged in
// @route // GET /torrents/:id
router.get('/:id', ensureAuth, torrentsController.viewTorrent);

// @desc  // Download completed Torrent folders to user machine
// @route // Post /torrents/download/:id
router.get('/download/:id', ensureAuth, torrentsController.downloadTorrent);

// @desc  // Delete TorrentID from database (torrent download will still remain on system)
// @route // Post /torrents/:id
router.delete('/:id', ensureAuth, torrentsController.deleteTorrent);

module.exports = router;
