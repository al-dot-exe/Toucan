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

// @desc  // Show Specific Torrent information if logged in
// @route // GET /torrents/:id 
router.get('/:id', ensureAuth, torrentsController.viewTorrent); // might be issue with reading

// @desc  // Download completed Torrent folders to user machine
// @route // Get /torrents/download/:id
router.get('/download/:id', ensureAuth, torrentsController.downloadTorrent); // might not be safe method

// @desc  // Upload .torrent to Torrent client
// @route // Post /torrents/file-upload
router.post('/file-upload', ensureAuth, uploads.single('.torrent'), torrentsController.postTorrent);

// @desc  // Upload magnet:uri's to Torrent client
// @route // Post /torrents/magnet-upload
router.post('/magnet-upload', ensureAuth, uploads.none(), torrentsController.postTorrent);

// // @desc  // Toggle seeding torrents on button click
// // @route // Post /torrents/toggle/:id
router.put('/toggle/:id', ensureAuth, torrentsController.toggleTorrent);

// // @desc  // Change upload rate of torrents on button click
// // @route // Post /torrents/upload-throttle
// router.put('/upload-throttle/:id', ensureAuth, torrentsController.throttleUploadSpeed);
//
// // @desc  // Change download rate of torrents on button click
// // @route // Post /torrents/download-throttle
// router.put('/download-throttle/:id', ensureAuth, torrentsController.throttleDownloadSpeed);

// @desc  // Delete TorrentID from database (torrent download will still remain on system)
// @route // Post /torrents/:id
router.delete('/:id', ensureAuth, torrentsController.deleteTorrent);

module.exports = router;
