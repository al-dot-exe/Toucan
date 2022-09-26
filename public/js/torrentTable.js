// client side js file for working with Torrent client in real time
async function startDashboardServices() {

   // Declare web sockets
   const socket = io(`http://localhost:3131/`); // band-aid

   // Init feathers app
   const app = feathers();

   // Register socket.io to talk to server
   app.configure(feathers.socketio(socket));

   // Initialize services
   init();

   // Event Listeners
   const clientToggle = document.getElementById('client-toggle');
   const clientRate = document.getElementById('client-rate');
   const throttleDropDown = document.getElementById('throttle-dropdown')
   const throttleDropDownButton = document.getElementById('throttle-dropdown-btn')
   const uploadThrottleUp = document.getElementById("upload-throttle-up")
   const uploadThrottleDown = document.getElementById("upload-throttle-down")
   const downloadThrottleUp = document.getElementById("download-throttle-up")
   const downloadThrottleDown = document.getElementById("download-throttle-down")
   const upMax = document.getElementById('upload-throttle')
   const downMax = document.getElementById('download-throttle')
   const torrentRows = document.querySelectorAll('.torrent-row');

   clientToggle.addEventListener('submit', toggleClient);
   uploadThrottleUp.addEventListener('submit', throttleUploadUp);
   uploadThrottleDown.addEventListener('submit', throttleUploadDown);
   downloadThrottleUp.addEventListener("submit", throttleDownloadUp);
   downloadThrottleDown.addEventListener("submit", throttleDownloadDown);
   torrentRows.forEach((row) => {
      row.childNodes[row.childNodes.length - 2].addEventListener('click', toggleTorrent);
   });

   throttleDropDown.addEventListener('click', (e) => e.stopPropagation());

   /*
   * Front End Updaters
   */
   async function renderClientRate() {
      await app.service('client-services').update(clientRate.id, clientRate);
      const clientStatus = await app.service('client-services').find();
      const upRate = clientStatus.currentUploadRate;
      const downRate = clientStatus.currentDownloadRate;
      clientRate.innerHTML = `${(upRate / 1000).toFixed(2)}/${(downRate / 1000).toFixed(2)}<small>KB/s</small>`
   }

   async function renderClientPausedStatus() {
      const clientStatus = await app.service('client-services').find();
      if (clientStatus.paused) {
         torrentRows.forEach(row => {
            row.className = "torrent-row paused"
            row.childNodes[row.childNodes.length - 2].childNodes[1].childNodes[1].childNodes[1].innerHTML = "<i class='bi bi-play-fill'></i>"
         });
         clientToggle.childNodes[3].innerHTML = "<i class='bi bi-play-fill'></i>";
      }
      else {
         torrentRows.forEach(row => {
            row.className = "torrent-row";
            row.childNodes[row.childNodes.length - 2].childNodes[1].childNodes[1].childNodes[1].innerHTML = "<i class='bi bi-pause-fill'></i>"
         });
         clientToggle.childNodes[3].innerHTML = "<i class='bi bi-pause-fill'></i>";
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
                     row.childNodes[row.childNodes.length - 4].innerText = torrent.progress;
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
         row.childNodes[row.childNodes.length - 2].childNodes[1].childNodes[1].childNodes[1].childNodes[0].data = ">";
      } else {
         row.className = "torrent-row";
         row.childNodes[row.childNodes.length - 2].childNodes[1].childNodes[1].childNodes[1].childNodes[0].data = "∎";
      }
   }

   // Upload limit updater
   async function renderNewUploadLimit() {
      const clientStatus = await app.service('client-services').find();
      upMax.innerHTML = `${(clientStatus.maxUploadRate / 1000)}<small>KB/s</small>`
   }

   //Download limit updater
   async function renderNewDownloadLimit() {
      const clientStatus = await app.service('client-services').find();
      downMax.innerHTML = `${(clientStatus.maxDownloadRate / 1000)}<small>KB/s</small>`
   }

   /*
   * Backend Services
   */

   // Toggle client pause or resume
   async function toggleClient(e) {
      e.preventDefault();
      await app.service('client-services').update(e.srcElement.id, clientToggle);
      const clientStatus = await app.service('client-services').find();
      const data = await app.service('torrent-services').find();
      data.forEach(async torrent => {
         torrent.paused = clientStatus.paused
         await app.service('torrent-services').update('torrent-toggle', torrent);
      })
      renderClientPausedStatus();
   }

   // Toggle torrent pause or resume
   async function toggleTorrent(e) {
      e.preventDefault();
      const clientStatus = await app.service('client-services').find();
      const torrentRow = e.srcElement.parentElement.parentElement.parentElement.parentElement
      const id = torrentRow.id
      const torrentsArray = await app.service('torrent-services').find();
      const data = torrentsArray.find(torrent => torrent.id === id);

      if (!clientStatus.paused) {
         data.paused = data.paused ? false : true;
         await app.service('torrent-services').update('torrent-toggle', data);
         changeTorrentPausedStatus(torrentRow, data);
      }
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
      torrentRows.forEach(async row => {
         await app.service('torrent-services').create({ id: row.id })
      });
      await app.service('torrent-services').remove(null);
      setInterval(renderTorrentUpdates, 1000)
      setInterval(renderClientRate, 500);
   }

}

export { startDashboardServices }
