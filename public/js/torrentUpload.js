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
   const modalClose = document.getElementById('upload-menu-close')
   const uploadPage = document.getElementById('torrent-upload-modal');
   const submissionPage = document.getElementById('torrent-submit-modal');
   const submissionBody = document.querySelector('.torrent-submit-body');
   const fileUploadStatus = document.getElementById('file-status');
   const fileDeleteButton = document.getElementById('file-delete');

   dotTorrentForm.addEventListener('submit', e => e.preventDefault());
   magnetURIForm.addEventListener('submit', e => e.preventDefault());
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
         : ''
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
          <section><h3>${data.name}</h3></section>
<section><h3>Info Hash:<br><br></h3><span>${data.infoHash}</span></section>
         <section><h3>Size:</h3><span>${data.length}</span></section>
         <section><h3>Date:</h3><span>${data.created}</span></section>
         <section><h3>Piece Length:</h3><span>${data.pieceLength}</span></section>
         <section><h3>Author:</h3><span>${data.createdBy}</span></section>
         <section><h3>Comments:</h3><span>${data.comment}</span></section>
         `
   }

   async function continueUpload(e, type) {
      if ((magnetURI.value || dotTorrent.value) && !(magnetURI.value && dotTorrent.value)) {
         const parsedTorrent = (magnetURI.value)
            ? await app.service('torrent-services').get(magnetURI.value)
            : await app.service('torrent-services').get(await dotTorrent.files[0].arrayBuffer());
         insertParsedTorrentData(parsedTorrent);
         if (!parsedTorrent) {
            alert('Invalid torrentId submitted');
            backButton.click(); // band-aid
         }
      } else {
         alert('Submit either a magnet link or a .torrent file');
         backButton.click(); // band-aid
      }
   }
}

export { startTorrentUploadProcess }
