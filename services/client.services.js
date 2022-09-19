// Services to give real time updates on Torrent client
const Torrent = require("../models/Torrent");
const User = require("../models/User");
const { client } = require("../config/webtorrent");

class ClientServices {
   constructor() {
      // this.client = client;
      // this.torrents = client.torrents;
      this.settings = {};
   }

   async find() {
      return this.settings;
   }

   async create(data) {
      maxDownloadRate: client.getDownloadLimit();
      maxUploadRate: client.getUploadLimit();
   }


   async update(id, data, params) {
      console.log('In update service');
      console.log(id);
      // console.log(params);

      // console.log(this.settings)
      if (id === 'download-throttle-down') decreaseDownloadSpeedLimit(this.settings);
      if (id === 'download-throttle-up') increaseDownloadSpeedLimit(this.settings);

      if (id === 'upload-throttle-down') decreaseUploadSpeedLimit(this.settings);
      if (id === 'upload-throttle-up') increaseUploadSpeedLimit(this.settings);

      function decreaseUploadSpeedLimit(settings) {
         try {
            client.setUploadLimit(-1000);
            settings.maxUploadRate = client.getUploadLimit();
            console.log('New upload limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get upload limit")
         }
      }

      function increaseUploadSpeedLimit(settings) {
         try {
            client.setUploadLimit(1000);
            settings.maxUploadRate = client.getUploadLimit();
            console.log('New upload limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get upload limit")
         }
      }

      function decreaseDownloadSpeedLimit(settings) {
         try {
            client.setDownloadLimit(-1000);
            settings.maxDownloadRate = client.getDownloadLimit();
            console.log('New download limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get download limit")
         }
      }
      function increaseDownloadSpeedLimit(settings) {
         try {
            client.setDownloadLimit(1000);
            settings.maxDownloadRate = client.getDownloadLimit();
            console.log('New download limit set')
         } catch (err) {
            console.error(err);
            console.log("Didn't get download limit")
         }
      }
   }


   // async pause() {
   //    this.torrents.forEach(torrent => {
   //       if (!torrent.paused) {
   //          torrent.pause();
   //       }
   //    });
   // }
   //
   // async resume() {
   //    this.torrents.forEach(torrent => {
   //       if (torrent.paused) {
   //          torrent.resume();
   //       }
   //    });
   // }
   //
   // async updateProgress() {
   //    return this.client.progress;
   // }
   //
   // async updateUploadSpeed() {
   //    try {
   //       return this.client.uploadSpeed;
   //    } catch (err) {
   //       console.error(err);
   //    }
   // }
   //
   // async updateDownloadSpeed() {
   //    try {
   //       return this.client.downloadSpeed;
   //    } catch (err) {
   //       console.error(err);
   //    }
   // }
   //
   //
}

const serviceClient = new ClientServices;
module.exports = serviceClient;
