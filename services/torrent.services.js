// Services to give real time services on individual torrents
const Torrent = require("../models/Torrent");
const { client } = require("../config/webtorrent");
const parseTorrent = require("parse-torrent");
const moment = require("moment");

class TorrentServices {
   constructor() {
      this.torrents = []
   }

   async create(data) {
      try {
         let torrentRecord;

         do { // loop to ensure the torrent record exists before its service is created
            torrentRecord = await Torrent.findByPk(data.id);
         } while (torrentRecord === null)

         const newTorrent = client.get(torrentRecord.id);
         if (!(this.torrents.map(torrent => (torrent.id)).includes(newTorrent.infoHash))) {
            const torrentService = {
               id: newTorrent.infoHash,
               paused: newTorrent.paused,
               progress: newTorrent.done ? 'Seeding' : newTorrent.progress,
               peerAddress: newTorrent.wires.map(wire => wire.remoteAddress),
               peerCount: newTorrent.numPeers,
               ready: newTorrent.ready,
               done: newTorrent.done,
               dataLeeched: newTorrent.downloaded,
               dataSeeded: newTorrent.uploaded,
               currentDownloadSpeed: newTorrent.downloadSpeed,
               currentUploadSpeed: newTorrent.uploadSpeed,
            }
            this.torrents.push(torrentService);
         }
      } catch (err) {
         console.log('Error when creating a torrent service');
         console.error(err);
      }
   }

   async find(params) {
      if (!params.query.id) {
         return this.torrents;
      } else {
         const filteredTorrents = this.torrents.filter(torrent => params.query.id === torrent.id);
         return filteredTorrents;
      }
   }

   async update(elementId, data) {
      try {
         if (elementId === 'all') statusUpdates(this.torrents);
         if (elementId === 'one') oneStatusUpdate(data.id);
         if (elementId === 'torrent-toggle') toggleTorrent(data, this.torrents);

         async function statusUpdates(torrents) {
            torrents.forEach(torrent => {
               let currentTorrent = client.get(torrent.id);
               if (currentTorrent) {
                  torrent.progress = currentTorrent.progress;
                  torrent.peerCount = currentTorrent.numPeers;
                  torrent.ready = currentTorrent.ready;
                  torrent.done = currentTorrent.done;
                  torrent.currentDownloadSpeed = currentTorrent.downloadSpeed;
                  torrent.currentUploadSpeed = currentTorrent.uploadSpeed;
                  torrent.dataSeeded = currentTorrent.uploaded;
                  torrent.dataLeeched = currentTorrent.downloaded;
               }
            });
         }

         function toggleTorrent(data, torrents) {
            let backendOfTorrent = client.get(data.id);
            data.paused ? backendOfTorrent.pause() : backendOfTorrent.resume();
            // band-aid
            torrents.forEach(torrent => {
               if (torrent.id === data.id) torrent.paused = backendOfTorrent.paused;
            });
         }
      } catch (err) {
         console.log('Something went wrong with torrent update services');
         console.error(err);
      }
   }

   async get(torrentID) {
      try {
         if (typeof torrentID === 'string') {
            torrentID = torrentID.split("'").join('');
            torrentID = torrentID.split(" ").join('').trim();
         }
         // if (torrentID.startsWith("'") || torrentID.endsWith("'")) {
         //    return "Couldn't parse magnet";
         // };
         const parsedTorrent = parseTorrent(torrentID)
         parsedTorrent.created = moment(parsedTorrent.created).format('MMMM Do YYYY, hh:mm:ss a');
         if (parsedTorrent.length >= (1024 ** 3)) {
            parsedTorrent.length = `${(parsedTorrent.length / (1024 ** 3)).toFixed(2)} GB`
         } else if (parsedTorrent.length >= (1024 ** 2)) {
            parsedTorrent.length = `${(parsedTorrent.length / (1024 ** 2)).toFixed(2)} MB`
         } else if (parsedTorrent.length >= 1024) {
            parsedTorrent.length = `${(parsedTorrent.length / (1024)).toFixed(2)} KB`
         } else {
            parsedTorrent.length = `${parsedTorrent.length} B`
         }
         return parsedTorrent;
      } catch (err) {
         console.error(err);
      }
   }

   async remove() {
      try {
         this.torrents = this.torrents.filter(async torrent => {
            const torrentStillExists = await Torrent.findByPk(torrent.id);
            torrentStillExists;
         });
         return this.torrents;
      } catch (err) {
         console.log('Something went wrong with removing torrent services');
         console.error(err);
      }
   }
}

const serviceTorrent = new TorrentServices;
module.exports = serviceTorrent;
