// Services to give real time updates on individual torrents
const Torrent = require("../models/Torrent");
const User = require("../models/User");
const { client } = require("../config/webtorrent");
const fs = require("fs-extra");
const JSZip = require("jszip");
const { createTorrentArchive } = require("../middleware/archive.js");

class TorrentServices {
   constructor() { // will probably need to target by torrent record id
      this.torrents = client.torrents;
      this.torrent = {};
   }
   async find() {
      return this.torrent;
   }
   async updateUploadSpeeds() {
      this.torrents.forEach(torrent => torrent.uploadSpeed);
   }
   async updateDownloadSpeeds() {
      this.torrents.forEach(torrent => torrent.downloadSpeed);
   }
   async getPeers() {
      return this.torrent.numPeers
   }


   async increaseUploadSpeedLimit() {
      try {
         client.setUploadLimit(1000);
         client.throttleUploadSpeed(client.getUploadLimit())
      } catch (err) {
         console.error(err);
      }
   }

   async decreaseUploadSpeedLimit() {
      try {
         client.setUploadLimit(-1000);
         client.throttleUploadSpeed(client.getUploadLimit())
      } catch (err) {
         console.error(err);
      }
   }

   async decreaseUploadSpeedLimit() {
      try {
         client.setUploadLimit(-1000);
         client.throttleUploadSpeed(client.getUploadLimit())
      } catch (err) {
         console.error(err);
      }
   }
}

const serviceTorrent = new TorrentServices;
module.exports = serviceTorrent;
