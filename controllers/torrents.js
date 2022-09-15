const Torrent = require("../models/Torrent");
const User = require("../models/User");
const { client } = require('../config/webtorrent');

module.exports = {
   getClientDashboard: async (req, res) => {
      // just trying things out but all of this would go inside a post request later
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
         const torrent = client.get(torrentModel.torrentID);
         res.render("viewTorrent", {
            user,
            torrent
         });
      } catch (err) {
         console.error(err); res.status().send(':(');
      }
   },

   postTorrent: async (req, res) => {
      try {
         const torrentID = req.body.torrentID.trim();

         const torrentExists = await Torrent.findOne({
            where: {
               torrentID: torrentID
            }
         });

         if(torrentID.startsWith("'")){
            req.flash("errors", {
               msg: "Invalid TorrentID"
            });
            return res.redirect('dashboard');
         }

         if (torrentExists) {
            req.flash("errors", {
               msg: "Torrent file already exists in database"
            });
            return res.redirect('dashboard');
         }

         client.add(torrentID, {
            path: 'database/torrents/'
         }, async (torrent) => {
            const newTorrent = Torrent.build({
               id: torrent.infoHash,
               name: torrent.name,
               torrentID: torrentID,
               folderPath: `database/torrents/${torrent.name}`,
               //category: eventually,
            });
            console.log(`Torrent file succesfully downloading, saving metadata to DB`)
            await newTorrent.save();
         });

         const user = await User.findByPk(req.user.id);

         req.flash("info", { msg: "added new torrent" });
         return res.redirect("dashboard");

      } catch (err) {
         console.error(err);
         req.flash("errors", { msg: "error while adding torrent to database" });
         return res.redirect('dashboard');
      }
   }
};
