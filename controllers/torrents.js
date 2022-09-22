const Torrent = require("../models/Torrent");
const User = require("../models/User");
const JSZip = require("jszip");
const { createTorrentArchive } = require("../middleware/archive.js");
const fs = require("fs-extra");
const { client } = require("../config/webtorrent");
const parseTorrent = require("parse-torrent");

module.exports = {
   getClientDashboard: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         let upMax = client.getUploadLimit();
         let downMax = client.getDownloadLimit();
         let upRate = client.uploadSpeed;
         let downRate = client.downloadSpeed;
         let torrentsArray = client.torrents;
         res.render("dashboard", {
            user,
            torrentsArray,
            upRate,
            downRate,
            upMax,
            downMax
         });
      } catch (err) {
         console.error(err);
         res.status(404).send(":(");
      }
   },

   getSeeding: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         let upMax = client.getUploadLimit();
         let downMax = client.getDownloadLimit();
         let upRate = client.uploadSpeed;
         let downRate = client.downloadSpeed;
         let torrentsArray = client.torrents.filter((torrent) => torrent.done);
         res.render("dashboard", {
            user,
            torrentsArray,
            upRate,
            downRate,
            upMax,
            downMax
         });
      } catch (err) {
         console.error(err);
         res.status(404).send(":(");
      }
   },

   getLeeching: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         let upMax = client.getUploadLimit();
         let downMax = client.getDownloadLimit();
         let upRate = client.uploadSpeed;
         let downRate = client.downloadSpeed;
         let torrentsArray = client.torrents.filter((torrent) => !torrent.done);
         res.render("dashboard", {
            user,
            torrentsArray,
            upRate,
            downRate,
            upMax,
            downMax
         });
      } catch (err) {
         console.error(err);
         res.status(404).send(":(");
      }
   },

   viewTorrent: async (req, res) => {
      try {
         const user = await User.findByPk(req.user.id);
         const torrentRecord = await Torrent.findByPk(req.params.id);
         const torrent = client.get(torrentRecord.id);
         res.render("viewTorrent", {
            user,
            torrent,
         });
      } catch (err) {
         console.error(err);
         res.status("500").send(":(");
      }
   },

   postTorrent: async (req, res) => {
      try {
         let torrentID = req.file ? req.file.path : req.body.magnet;
         if (typeof torrentID === 'string') {
            torrentID = torrentID.split("'").join('');
            torrentID = torrentID.split(" ").join('').trim();
         }
         if (torrentID.startsWith("'") || torrentID.endsWith("'")) {
            req.flash("errors", {
               msg: "Invalid TorrentID",
            });
            res.redirect("dashboard");
         }
         let torrentExists;
         let id;
         if (torrentID.startsWith('magnet')) {
            id = parseTorrent(torrentID).infoHash;
         } else {
            id = parseTorrent(fs.readFileSync(req.file.path)).infoHash;
         }
         torrentExists = await Torrent.findByPk(id);

         if (!torrentExists) {
            client.add(
               torrentID,
               {
                  path: "database/torrents/",
               },
               async (torrent) => {
                  torrentID = req.file ? torrent.torrentFile : torrentID;
                  const newTorrent = Torrent.build({
                     id: torrent.infoHash,
                     name: torrent.name,
                     torrentID: torrentID,
                     folderPath: `database/torrents/${torrent.name}`,
                  });
                  await newTorrent.save();
                  console.log(
                     `\nTorrent file ${torrent.name} succesfully downloading, saving metadata to DB\n`
                  );
               }
            );
            req.flash("info", { msg: "Torrent added to the nest" });
         } else {
            req.flash("errors", { msg: "Torrent already in the nest" });
         }
         if (req.file) {
            console.log('\nCleaning out .torrent files from uploads folder...\n')
            fs.remove(req.file.path, err => {
               if (err) return console.error('.torrent upload was not removed after being added to client\n')
               console.log('\n.torrent files removed\n')
            });
         }
         res.redirect("dashboard");
      } catch (err) {
         console.error(err);
         req.flash("errors", { msg: "Please upload a valid magnet uri or .torrent file" });
         return res.redirect("dashboard");
      }
   },


   downloadTorrent: async (req, res) => {
      try {
         const torrentRecord = await Torrent.findByPk(req.params.id);
         let torrentPath = torrentRecord.folderPath;
         if (!fs.existsSync(torrentPath)) {
            console.log(
               "\nCan't find requested torrent\nRegenerating file path for torrent record..."
            );
            torrentPath = `database/torrents/${torrentRecord.name}`;
         }

         const status = client.get(torrentRecord.id);
         const torrentIsDir = fs.statSync(torrentPath).isDirectory();

         if (status.done) {
            if (torrentIsDir) {
               const zip = new JSZip();
               const torrentArchive = zip.folder(torrentRecord.name);
               createTorrentArchive(torrentPath, torrentArchive);

               console.log("\nGenerating Torrent .zip...");
               zip
                  .generateNodeStream({ type: "nodebuffer", streamFiles: true })
                  .pipe(
                     fs.createWriteStream(`${torrentPath}/${torrentRecord.name}.zip`)
                  )
                  .on("finish", () => {
                     //updating path first will ensure next time is faster
                     torrentPath = `${torrentPath}/${torrentRecord.name}.zip`;
                     Torrent.update(
                        { folderPath: torrentPath },
                        {
                           where: {
                              id: req.params.id,
                           },
                        }
                     );
                     console.log("\nSuccess! sending done torrent to user!");
                     res.download(torrentPath);
                  });
            } else {
               console.log("\nSending done torrent to user!");
               res.download(torrentPath);
            }
         } else {
            req.flash("info", {
               msg: "Torrent file is not finished seeding.",
            });
            return res.redirect("../dashboard");
         }
      } catch (err) {
         console.error(err);
         req.flash("errors", {
            msg: "Error couldn't download torrent file from database",
         });
         return res.redirect("../dashboard");
      }
   },

   deleteTorrent: async (req, res) => {
      try {
         console.log(req.params.id);
         const torrentRecord = await Torrent.findByPk(req.params.id);
         console.log(client.torrents)
         console.log(torrentRecord);
         console.log(`Removing torrent record ${torrentRecord.id} from database...`);
         await torrentRecord.destroy();
         console.log(client.torrents);
         client.remove(req.params.id);
         req.flash("info", {
            msg: `Torrent record ${req.params.id} has been deleted`,
         });
         console.log(client.torrents);
         res.redirect("dashboard");
      } catch (err) {
         console.error(err);
         res.redirect("dashboard");
      }
   },
};
