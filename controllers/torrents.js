const Torrent = require("../models/Torrent");
const User = require("../models/User");
const { client } = require('../config/webtorrent');

module.exports = {
   getClientDashboard: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         let upRate = client.uploadSpeed;
         let downRate = client.downloadSpeed;
         let torrentsArray = client.torrents;
         res.render("dashboard", {
            user,
            torrentsArray,
            upRate,
            downRate
         });
      } catch (err) {
         console.error(err);
         res.status(404).send(':(');
      }
   },

   viewTorrent: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         const torrentModel = await Torrent.findByPk(req.params.id);
         const torrent = client.get(torrentModel.id);
         console.log(torrentModel);
         res.render("viewTorrent", {
            user,
            torrent
         });
      } catch (err) {
         console.error(err);
         res.status('500').send(':(');
      }
   },

   postTorrent: async (req, res) => {
      try {
         let torrentID = (req.file) ? req.file.path : req.body.magnet;
         if (torrentID.startsWith("'") || (torrentID.endsWith("'"))) {
            req.flash("errors", {
               msg: "Invalid TorrentID"
            });
            return res.redirect('dashboard');
         }

         client.add(torrentID, {
            path: 'database/torrents/'
         }, async (torrent) => {
            torrentID = (req.file) ? torrent.torrentFile : torrentID;
            const newTorrent = Torrent.build({
               id: torrent.infoHash,
               name: torrent.name,
               torrentID: torrentID,
               folderPath: `database/torrents/${torrent.name}`,
            });
            await newTorrent.save();
            console.log(`Torrent file ${torrent.name} succesfully downloading, saving metadata to DB`)
         });

         req.flash("info", { msg: "added new torrent" });
         return res.redirect("dashboard");

      } catch (err) {
         console.error(err);
         req.flash("errors", { msg: "error while adding torrent to database" });
         return res.redirect('dashboard');
      }
   }
};
