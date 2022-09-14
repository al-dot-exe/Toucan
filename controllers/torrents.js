const Torrent = require("../models/Torrent");
const User = require("../models/User");
const { client } = require('../config/webtorrent');

module.exports = {
   getClientDashboard: async (req, res) => {
      // just trying things out but all of this would go inside a post request later
      try {
         torrentsArray = client.torrents;
         const user = await User.findByPk(req.user.id);
         res.render("dashboard", {
            user,
            torrentsArray
         });
      } catch (err) {
         console.error(err);
         res.status(404).send(':(');
      }
   },

   postTorrent: async (req, res) => {
      try {
         const torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'
          
         const newTorrent = client.add(torrentId, {
            path: 'database/torrents/'
         }, (torrent) => {
            console.log(`Torrent File succesfully downloading`)
         });

         const user = await User.findByPk(req.user.id);

         req.flash("info", { msg: "added new torrent" });
         return res.redirect("dashboard");
      } catch (err) {
         console.error(err);
         return res.status(500).send(':(');
      }
   }
};
