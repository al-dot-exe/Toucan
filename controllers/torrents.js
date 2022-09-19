const Torrent = require("../models/Torrent");
const User = require("../models/User");
const { client } = require("../config/webtorrent");
const fs = require("fs-extra");
const JSZip = require("jszip");
const { createTorrentArchive } = require("../middleware/archive.js");

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
      console.log(req);
      const torrent = client.get(torrentRecord.id);
      // console.log(torrentRecord);
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
      if (torrentID.startsWith("'") || torrentID.endsWith("'")) {
        req.flash("errors", {
          msg: "Invalid TorrentID",
        });
        return res.redirect("dashboard");
      }

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
            `Torrent file ${torrent.name} succesfully downloading, saving metadata to DB`
          );
        }
      );

      req.flash("info", { msg: "added new torrent" });
      return res.redirect("dashboard");
    } catch (err) {
      console.error(err);
      req.flash("errors", { msg: "error while adding torrent to database" });
      return res.redirect("dashboard");
    }
  },

  toggleTorrent: async (req, res) => {
    try {
      const torrentRecord = await Torrent.findByPk(req.params.id);
      const torrent = client.get(torrentRecord.id);
      torrent.paused ? torrent.resume() : torrent.pause();
      req.flash("info", {
        msg: torrent.paused
          ? `${torrent.name} paused!`
          : `${torrent.name} resumed!`,
      });
      res.redirect("../dashboard");
    } catch (err) {
      console.error(err);
      res.redirect("../dashboard");
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
          createTorrentArchive(torrentRecord.name, torrentPath, torrentArchive);

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
              req.flash("info", { msg: "Downloaded torrent" });
              res.download(torrentPath);
            });
        } else {
          console.log("\nSending done torrent to user!");
          req.flash("info", { msg: "Downloaded torrent" });
          res.download(torrentPath);
        }
      } else {
        req.flash("info", {
          msg: "Torrent file is not complete. It may have too few seeders...",
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
      console.log(`Removing torrent record ${req.params.id} from database...`);
      client.remove(req.params.id);
      await Torrent.destroy({
        where: {
          id: req.params.id,
        },
      });
      req.flash("info", {
        msg: `Torrent record ${req.params.id} has been deleted`,
      });
      res.redirect("dashboard");
    } catch (err) {
      console.error(err);
      res.redirect("dashboard");
    }
  },
};
