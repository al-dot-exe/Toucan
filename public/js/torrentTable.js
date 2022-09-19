// client side js file for working with torrent client screen table
async function renderClientServices() {

   const socket = io(`http://localhost:3000/`);

   // Init feathers app
   const app = feathers();

   // Register socket.io to talk to server
   app.configure(feathers.socketio(socket));

   // Event Listeners
   const uploadRateUp = document.getElementById("upload-throttle-up")
   const uploadRateDown = document.getElementById("upload-throttle-down")
   const downloadRateUp = document.getElementById("download-throttle-up")
   const downloadRateDown = document.getElementById("download-throttle-down")
   const upMax = document.getElementById('upload-throttle')
   const downMax = document.getElementById('download-throttle')

   uploadRateUp.addEventListener('submit', throttleUploadUp);
   uploadRateDown.addEventListener('submit', throttleUploadDown);
   downloadRateUp.addEventListener("submit", throttleDownloadUp);
   downloadRateDown.addEventListener("submit", throttleDownloadDown);

   // grab the services
   init();



   // Upload Limits
   async function renderNewUploadLimit(){
      const clientSettings = await app.service('client-services').find();
      upMax.innerText = `${(clientSettings.maxUploadRate / 1000).toFixed(2)}`
   } 

   function throttleUploadUp(e) {
      e.preventDefault();
      app.service('client-services').update(e.srcElement.id, uploadRateUp);
      renderNewUploadLimit();
   }

   function throttleUploadDown(e) {
      e.preventDefault();
      app.service('client-services').update(e.srcElement.id, uploadRateDown);
      renderNewUploadLimit();
   }

   //Download Limits
   async function renderNewDownloadLimit(){
      const clientSettings = await app.service('client-services').find();
      downMax.innerText = `${(clientSettings.maxDownloadRate / 1000).toFixed(2)}`
   } 


   function throttleDownloadUp(e) {
      e.preventDefault();
      app.service('client-services').update(e.srcElement.id, downloadRateUp);
      renderNewDownloadLimit();
   }

   function throttleDownloadDown(e) {
      e.preventDefault();
      app.service('client-services').update(e.srcElement.id, downloadRateDown);
      renderNewDownloadLimit();
   }

   async function init() {
      const clientSettings = await app.service('client-services').find();
   }

}


export { renderClientServices }
