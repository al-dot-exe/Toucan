// client side js for uploading torrent files
async function startTorrentUploadProcess() {
   // Init feathers app
   const app = feathers();

   const socket = io(`http://localhost:3131/`); // band-aid

   // Register socket.io to talk to server
   app.configure(feathers.socketio(socket));


   // queried DOM elements and event listeners

   const magnetURI = document.getElementById('magnet-uri-input');
   const dotTorrent = document.getElementById('dot-torrent');
   const dotTorrentForm = document.getElementById('dot-torrent-upload-form');
   const magnetURIForm = document.getElementById('magnet-upload-form');
   const nextButton = document.getElementById('upload-continue')
   const backButton = document.getElementById('upload-back');
   const cancelButton = document.getElementById('upload-cancel');
   const submitButton = document.getElementById('upload-submit');
   const modalClose = document.getElementById('upload-menu-close')
   const uploadPage = document.getElementById('torrent-upload-modal');
   const submissionPage = document.getElementById('torrent-submit-modal');
   const submissionBody = document.querySelector('.torrent-submit-body');
   const fileUploadStatus = document.getElementById('file-status');
   const fileDeleteButton = document.getElementById('file-delete');

   nextButton.addEventListener('click', continueUpload);
   cancelButton.addEventListener('click', clearUpload);
   modalClose.addEventListener('click', clearUpload);
   dotTorrent.addEventListener('change', updateFileStatus);
   fileDeleteButton.addEventListener('click', clearUpload);

   const fileStatus = `${dotTorrent.value
      ? dotTorrent.value.split("\\").pop()
      : 'no file selected...'}`

   fileUploadStatus.textContent = fileStatus

   fileDeleteButton.innerHTML = !(fileStatus == 'no file selected...')
      ? `<i class="bi bi-x-circle-fill bg-none"></i>`
      : ''

   function updateFileStatus() {
      const fileStatus = `${dotTorrent.value
         ? dotTorrent.value.split("\\").pop()
         : 'no file selected...'}`

      fileUploadStatus.textContent = fileStatus

      fileDeleteButton.innerHTML = !(fileStatus == 'no file selected...')
         ? `<i class="bi bi-x-circle-fill bg-none"></i>`
         : '';
      (dotTorrent.value)
         ? submitButton.setAttribute('form', 'dot-torrent-upload-form')
         : submitButton.setAttribute('form', 'magnet-upload-form');
   }


   function clearUpload() {
      magnetURI.value = '';
      dotTorrent.value = '';
      submissionBody.innerHTML = ''
      updateFileStatus();
   }

   function insertParsedTorrentData(data) {
      data.name = (!data.name) ? 'Unknown name' : data.name;
      data.infoHash = (!data.infoHash) ? '...' : data.infoHash;
      data.length = (!data.length) ? '...' : data.length;
      data.created = (!data.created) ? '...' : data.created
      data.pieceLength = (!data.pieceLengt) ? '...' : data.pieceLength;
      data.createdBy = (!data.createdBy) ? '...' : data.createdBy;
      data.comment = (!data.comment) ? '...' : data.comment;
      submissionBody.innerHTML =
         `
          <h3 id="torrent-name" class="ms-2">${data.name}</h3>
         <div id="torrent-submit-info" class="d-flex flex-column justify-content-center pt-2">
            <section><h4>Info Hash:<br></h4><span>${data.infoHash}</span></section>
            <section><h4>Size:</h4><span>${data.length}</span></section>
            <section><h4>Date:</h4><span>${data.created}</span></section>
            <section><h4>Piece Length:</h4><span>${data.pieceLength}</span></section>
            <section><h4>Author:</h4><span>${data.createdBy}</span></section>
            <section class="border-none"><h4>Comments:</h4><span>${data.comment}</span></section>
         </div>
         `
   }

   async function continueUpload(e, type) {
      if ((magnetURI.value || dotTorrent.value) && !(magnetURI.value && dotTorrent.value)) {
         const parsedTorrent = (magnetURI.value)
            ? await app.service('torrent-services').get(magnetURI.value)
            : await app.service('torrent-services').get(await dotTorrent.files[0].arrayBuffer());
         if (!parsedTorrent) {
            alert('Invalid torrentId submitted');
            backButton.click(); // band-aid
         } else {
            insertParsedTorrentData(parsedTorrent);
         }
      } else {
         alert('Submit either a magnet link or a .torrent file');
         backButton.click(); // band-aid
      }
      updateFileStatus();
   }
}

export { startTorrentUploadProcess }
