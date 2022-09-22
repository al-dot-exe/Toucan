// Services to give real time updates on Torrent client
// const Torrent = require("../models/Torrent");
// const User = require("../models/User");
const { client } = require("../config/webtorrent");

class ClientServices {
   constructor() {
      this.status = {};
   }

   async find() {
      return this.status
   }

   async create() {
      this.status = {
         paused: false,
         currentUploadRate: client.uploadSpeed,
         currentDownloadRate: client.downloadSpeed,
         maxDownloadRate: client.getDownloadLimit(),
         maxUploadRate: client.getUploadLimit(),
         torrents: [],
      }
      client.torrents.forEach(torrent => this.status.torrents.push(torrent.infoHash));
      return this.status;
   }


   async update(id, data, params) {

      if (id === 'client-rate') {
         this.status.currentUploadRate = client.uploadSpeed;
         this.status.currentDownloadRate = client.downloadSpeed;
      }

      // Pause or Resume
      if (id === 'client-toggle') toggleClient(this.status);

      // Max rate throttle services
      if (id === 'download-throttle-down') decreaseDownloadSpeedLimit(this.status);
      if (id === 'download-throttle-up') increaseDownloadSpeedLimit(this.status);
      if (id === 'upload-throttle-down') decreaseUploadSpeedLimit(this.status);
      if (id === 'upload-throttle-up') increaseUploadSpeedLimit(this.status);


      function toggleClient(status) {
         try {
            const pausedTorrents = client.torrents.filter(torrent => torrent.paused);
            const halfOfTorrents = Math.floor(status.torrents.length / 2);

            if (pausedTorrents.length > halfOfTorrents) {
               client.torrents.forEach(torrent => torrent.resume())
               status.paused = false
            } else if (pausedTorrents.length < halfOfTorrents) {
               client.torrents.forEach(torrent => torrent.pause());
               status.paused = true
            } else {
               (status.paused)
                  ? client.torrents.forEach(torrent => torrent.resume())
                  : client.torrents.forEach(torrent => torrent.pause());
               if (status.paused) status.paused = false;
            }
         } catch (err) {
            console.log("Couldn't pause all torrents.");
            console.error(err);
         }
      }

      function decreaseUploadSpeedLimit(status) {
         try {
            client.setUploadLimit(-1000);
            status.maxUploadRate = client.getUploadLimit();
            console.log('New upload limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get upload limit")
         }
      }

      function increaseUploadSpeedLimit(status) {
         try {
            client.setUploadLimit(1000);
            status.maxUploadRate = client.getUploadLimit();
            console.log('New upload limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get upload limit")
         }
      }

      function decreaseDownloadSpeedLimit(status) {
         try {
            client.setDownloadLimit(-1000);
            status.maxDownloadRate = client.getDownloadLimit();
            console.log('New download limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get download limit")
         }
      }
      function increaseDownloadSpeedLimit(status) {
         try {
            client.setDownloadLimit(1000);
            status.maxDownloadRate = client.getDownloadLimit();
            console.log('New download limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get download limit")
         }
      }
   }
}

const serviceClient = new ClientServices;
module.exports = serviceClient;
