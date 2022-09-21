// Services to give real time updates on individual torrents
const Torrent = require("../models/Torrent");
// const User = require("../models/User");
const { client } = require("../config/webtorrent");

class TorrentServices {
   constructor() {
      this.torrents = []
   }

   async create(data) {
      try {
         let torrentRecord = await Torrent.findByPk(data.id)
         const newTorrent = client.get(torrentRecord.id);
         if (this.torrents.map(torrent => (torrent.id)).includes(newTorrent.infoHash)) {
         } else {
            const torrentEntry = {
               id: newTorrent.infoHash,
               paused: newTorrent.paused,
               progress: newTorrent.done ? 'Seeding' : newTorrent.progress,
               peerAddress: newTorrent.wires.map(wire => wire.remoteAddress),
               peerCount: newTorrent.numPeers,
               ready: newTorrent.ready,
               done: newTorrent.done,
               currentDownloadSpeed: newTorrent.downloadSpeed,
               currentUploadSpeed: newTorrent.uploadSpeed
            }
            this.torrents.push(torrentEntry);
         }
      } catch (err) {
         console.log('Something went wrong when creating a torrent service');
         console.error(err);
      }
   }

   async find() {
      return this.torrents;
   }

   async update(elementId, data, params) {
      try {
         // update a specific torrent
         if (elementId === 'all') statusUpdates(this.torrents);
         if (elementId === 'torrent-toggle') toggleTorrent(data.id, this.torrents);

         async function statusUpdates(torrents) {
            torrents.forEach(torrent => {

               let currentTorrent = client.get(torrent.id);
               if (currentTorrent) {
                  torrent.progress = currentTorrent.done ? 'Seeding' : currentTorrent.progress;
                  torrent.peerCount = currentTorrent.numPeers;
                  torrent.ready = currentTorrent.ready;
                  torrent.done = currentTorrent.done;
                  torrent.currentDownloadSpeed = currentTorrent.downloadSpeed,
                     torrent.currentUploadSpeed = currentTorrent.uploadSpeed;
               }
            });
         }

         function toggleTorrent(torrentId, torrents) {
            console.log("backend")
            console.log(elementId);
            console.log(`Passed in data`);
            console.log(data);
            let currentTorrent = client.get(torrentId);
            console.log(`Backend paused status: ${currentTorrent.paused}`);
            data.paused ? currentTorrent.pause() : currentTorrent.resume();
            console.log(`Updated backend paused status: ${currentTorrent.paused}`);

            // band-aid
            torrents.forEach(torrent => {
               if (torrent.id === data.id) torrent.paused = currentTorrent.paused;
            });
         }
      } catch (err) {
         console.log('Something went wrong with torrent update services');
         console.error(err);
      }
   }

   // Currently not working as intended
   async remove(call, query) {
      try {
         console.log('\nMade it to remove\n');
         console.log(query);
         this.torrents = this.torrents.filter(torrent => {
            console.log(torrent.done)
         });
         return this.torrents
      } catch (err) {
         console.log('Something went wrong with removing torrent services');
         console.error(err)
      }
   }
}

const serviceTorrent = new TorrentServices;
module.exports = serviceTorrent;
