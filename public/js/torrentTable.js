// client side js file for working with torrent client screen table
async function renderDashboardServices() {

   const socket = io(`http://localhost:3000/`);

   // Init feathers app
   const app = feathers();

   // Register socket.io to talk to server
   app.configure(feathers.socketio(socket));

   // Initialize services
   init();

   // Event Listeners
   const clientToggle = document.getElementById('client-toggle');
   const torrentRows = document.querySelectorAll('.torrent-row');
   const clientRate = document.getElementById('client-rate');
   const uploadThrottleUp = document.getElementById("upload-throttle-up")
   const uploadThrottleDown = document.getElementById("upload-throttle-down")
   const downloadThrottleUp = document.getElementById("download-throttle-up")
   const downloadThrottleDown = document.getElementById("download-throttle-down")
   const upMax = document.getElementById('upload-throttle')
   const downMax = document.getElementById('download-throttle')


   clientToggle.addEventListener('submit', toggleClient);
   uploadThrottleUp.addEventListener('submit', throttleUploadUp);
   uploadThrottleDown.addEventListener('submit', throttleUploadDown);
   downloadThrottleUp.addEventListener("submit", throttleDownloadUp);
   downloadThrottleDown.addEventListener("submit", throttleDownloadDown);

   torrentRows.forEach((row, index) => {
      row.childNodes[row.childNodes.length - 2].addEventListener('click', toggleTorrent);
   });


   // Client side renderers
   async function renderClientRate() {
      await app.service('client-services').update(clientRate.id, clientRate);
      const clientStatus = await app.service('client-services').find();
      const upRate = clientStatus.currentUploadRate;
      const downRate = clientStatus.currentDownloadRate;
      clientRate.innerText = `Rate: ${(upRate / 1000).toFixed(2)}/${(downRate / 1000).toFixed(2)} KB/s`
   }

   async function renderClientPausedStatus() {
      const clientStatus = await app.service('client-services').find();
      if (clientStatus.paused) {
         torrentRows.forEach(row => {
            row.className = "torrent-row paused"
            row.childNodes[row.childNodes.length - 4].innerText = 'Paused';
         });
         clientToggle.childNodes[3].childNodes[1].textContent = 'paused';
      }
      else {
         torrentRows.forEach(row => {
            row.className = "torrent-row";
            row.childNodes[row.childNodes.length - 4].innerText = 'running';
         });
      }
   }


   async function renderTorrentUpdates() {
      await app.service('torrent-services').update('all', torrentRows);
      const torrents = await app.service('torrent-services').find();
      torrentRows.forEach(row => {
         torrents.forEach(torrent => {
            if (torrent.id == row.id) {
               row.childNodes[row.childNodes.length - 6].childNodes[0].data =
                  `${torrent.peerCount}`;
               row.childNodes[row.childNodes.length - 8].childNodes[0].data =
                  `${(torrent.currentDownloadSpeed / 1000).toFixed(2)}KB/s`
               row.childNodes[row.childNodes.length - 10].childNodes[0].data =
                  `${(torrent.currentUploadSpeed / 1000).toFixed(2)}KB/s `
               if (!torrent.paused) {
                  if (torrent.done == false) {
                     row.childNodes[row.childNodes.length - 4].innerText =
                        `${(torrent.progress * 100).toFixed(2)}%`;
                  } else {
                     row.childNodes[row.childNodes.length - 4].innerText = 'Seeding';
                  }
               }
            }
         })
      });
   }

   async function changeTorrentPausedStatus(row, currentData) {
      if (currentData.paused) {
         row.className = 'torrent-row paused'
         row.childNodes[row.childNodes.length - 4].innerText = 'Paused';
      } else {
         row.className = "torrent-row";
      }
   }

   // Upload limit updater
   async function renderNewUploadLimit() {
      const clientStatus = await app.service('client-services').find();
      upMax.innerText = `${(clientStatus.maxUploadRate / 1000)}`
   }

   //Download limit updater
   async function renderNewDownloadLimit() {
      const clientStatus = await app.service('client-services').find();
      downMax.innerText = `${(clientStatus.maxDownloadRate / 1000)}`
   }

   // Services
   // Toggle client pause or resume
   async function toggleClient(e) {
      e.preventDefault();
      await app.service('client-services').update(e.srcElement.id, clientToggle);
      renderClientPausedStatus();
   }

   // Toggle torrent pause or resume
   async function toggleTorrent(e) {
      e.preventDefault();
      // band-aid
      const torrentRow = e.srcElement.parentElement.parentElement.parentElement.parentElement
      const id = torrentRow.id
      const torrentsArray = await app.service('torrent-services').find();
      const currentTorrent = torrentsArray.find(torrent => torrent.id === id);
      currentTorrent.paused = currentTorrent.paused ? false : true;
      await app.service('torrent-services').update('torrent-toggle', currentTorrent);
      changeTorrentPausedStatus(torrentRow, currentTorrent);
   }

   async function throttleUploadUp(e) {
      e.preventDefault();
      await app.service('client-services').update(e.srcElement.id, uploadThrottleUp);
      renderNewUploadLimit();
   }

   async function throttleUploadDown(e) {
      e.preventDefault();
      await app.service('client-services').update(e.srcElement.id, uploadThrottleDown);
      renderNewUploadLimit();
   }


   async function throttleDownloadUp(e) {
      e.preventDefault();
      await app.service('client-services').update(e.srcElement.id, downloadThrottleUp);
      renderNewDownloadLimit();
   }

   async function throttleDownloadDown(e) {
      e.preventDefault();
      await app.service('client-services').update(e.srcElement.id, downloadThrottleDown);
      renderNewDownloadLimit();
   }

   async function init() {
      await app.service('client-services').create(document.getElementById('torrent-table'));
      torrentRows.forEach(async row => await app.service('torrent-services').create({ id: row.id }));
      const torrents = await app.service('torrent-services').find()

      setInterval(renderClientRate, 500);
      torrents.forEach(torrent => {
         setInterval(renderTorrentUpdates, 1000);
      })
   }

}


export { renderDashboardServices }
