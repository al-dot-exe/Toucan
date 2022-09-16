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

// @desc  // Upload .torrent to client
// @route // Post /
router.post('/file-upload', ensureAuth, uploads.single('.torrent'), torrentsController.postTorrent);

// @desc  // Upload magnet:uri's to client
// @route // Post /
router.post('/magnet-upload', ensureAuth, uploads.none(), torrentsController.postTorrent);

// @desc  // Show Specific Torrent information if logged in
// @route // GET /torrents/:id
router.get('/:id', ensureAuth, torrentsController.viewTorrent);

module.exports = router;
