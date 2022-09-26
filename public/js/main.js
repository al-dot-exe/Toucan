// custom client side js goes here
import { startDashboardServices } from "./torrentTable.js";
import { startTorrentUploadProcess } from "./torrentUpload.js";

if (window.location.pathname === "/torrents/dashboard" ||
   window.location.pathname === "/torrents/seeding" ||
   window.location.pathname === "/torrents/leeching"){
   startDashboardServices();
   startTorrentUploadProcess();
}

if(window.location.pathname === "/") startTorrentUploadProcess();

// inputs are dragging and not selecting correclty <,<
// document.querySelectorAll('input').forEach(input => {
//    input.addEventListener('dblclick', () => this.select())
//    input.addEventListener('click', () => this.select());
// });
