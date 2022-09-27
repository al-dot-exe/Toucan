// client side js file for working with Torrent client in real time
async function startTorrentViewServices() {

   // Declare web sockets
   const socket = io(`http://localhost:3131/`); // band-aid

   // Init feathers app
   const app = feathers();

   // Register socket.io to talk to server
   app.configure(feathers.socketio(socket));

   // Select DOM items and Event Listeners
try {
   const infoHash = document.getElementById('hash-value').textContent;
   const progressStatus = document.getElementById("progress-status");
   const torrentUploadSpeed = document.getElementById("upload-speed");
   const torrentDownloadSpeed = document.getElementById("download-speed");
   const seeded = document.getElementById('data-seeded');
   const leeched = document.getElementById('data-leeched');
   const peersList = document.getElementById('peers-list');
   const announceList = document.getElementById('announce-list');
} catch (err) {
      //band-aid
      console.log("Not in torrent view");
}



   async function renderTorrentUpdates() {
      await app.service('torrent-services').update('all', { id: infoHash });
      const torrentQuery = await app.service('torrent-services').find({
         query: {
            id: infoHash,
         }
      });
      const torrent = torrentQuery[0];

      // Seed status
      if (torrent.done) {
         progressStatus.innerHTML =
            `Seeding: <i class="bi bi-check-circle-fill"></i>`
      } else {
         progressStatus.textContent =
            `Leeching ${(torrent.progress * 100).toFixed(2)}%`;
      }

      // Client Rate
      torrentUploadSpeed.innerHTML =
         `${(torrent.currentUploadSpeed / 1000).toFixed(2)}KB/s
            <i class="bi bi-arrow-up px-0"></i>`
      torrentDownloadSpeed.innerHTML =
         `${(torrent.currentDownloadSpeed / 1000).toFixed(2)}KB/s
            <i class="bi bi-arrow-down px-0"></i>`

      // Seed Ratio
         seeded.innerHTML = ''
      if (torrent.dataSeeded >= (1024 ** 3)) {
         seeded.innerHTML =
            `${(torrent.dataSeeded / (1024 ** 3)).toFixed(2)}GB`
      } else if (torrent.dataSeeded >= (1024 ** 2)) {
         seeded.innerHTML =
            `${(torrent.dataSeeded / (1024 ** 2)).toFixed(2)}MB`
      } else if (torrent.dataSeeded >= 1024) {
         seeded.innerHTML =
            `${(torrent.dataSeeded / 1024).toFixed(2)}KB`
      } else {
         seeded.innerHTML =
            `${torrent.dataSeeded}B`
      }

      leeched.innerHTML = ''
      if (torrent.dataLeeched >= (1024 ** 3)) {
         leeched.innerHTML =
         `${(torrent.dataLeeched / (1024 ** 3)).toFixed(2)}GB`
      } else if (torrent.dataLeeched >= (1024 ** 2)) {
         leeched.innerHTML =
         `${(torrent.dataLeeched / (1024 ** 2)).toFixed(2)}MB`
      } else if (torrent.dataLeeched >= 1024) {
         leeched.innerHTML =
         `${(torrent.dataLeeched / (1024)).toFixed(2)}KB`
      } else {
         `${torrent.dataLeeched}B`
      }
   }

   const init = async () => {
      // create a service if it hasn't been created already
      await app.service('torrent-services').create({ id: infoHash });
      setInterval(renderTorrentUpdates, 1000)
   }


   // Initialize service if the torrent hash is in the database


   init();
}

export { startTorrentViewServices }
