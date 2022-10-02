// custom client side js goes here
import { startDashboardServices } from "./torrentTable.js";
import { startTorrentUploadProcess } from "./torrentUpload.js";
import { startTorrentViewServices } from "./torrentView.js";
import { startFileSearchServices } from "./fileSearch.js";

if (
  window.location.pathname === "/torrents/dashboard" ||
  window.location.pathname === "/torrents/seeding" ||
  window.location.pathname === "/torrents/leeching"
) {
  startDashboardServices();
  startTorrentUploadProcess();
}

if (window.location.pathname === "/") startTorrentUploadProcess();

startTorrentViewServices(); //band-aid
startFileSearchServices();

if (
  window.location.pathname === "/login" ||
  window.location.pathname === "/signup"
) {
  const passwordFields = document.querySelectorAll(".password-field");
  const passwordToggle = document.getElementById("password-hide-toggle");
  
  passwordToggle.addEventListener("click", (e) => {
    if (passwordToggle.childNodes[1].id != "hidden") {
      passwordToggle.childNodes[1].id = "hidden";
      passwordToggle.childNodes[1].textContent = "show password";
      passwordFields.forEach(field => field.type = "password");
      passwordToggle.childNodes[3].childNodes[1].outerHTML = '<i class="bi bi-eye-slash-fill"></i>';
    } else {
      passwordToggle.childNodes[1].id = "visible";
      passwordToggle.childNodes[1].textContent = "hide password";
      passwordFields.forEach(field => field.type = "text");
      passwordToggle.childNodes[3].childNodes[1].outerHTML = '<i class="bi bi-eye-fill"></i>';
    }
  });
}
