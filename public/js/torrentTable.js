// client side js file for working with Torrent client in real time
async function startDashboardServices() {
  // Declare web sockets
  const socket = io(`https://localhost:3131/`, {});

  // Init feathers app
  const app = feathers();

  // Register socket.io to talk to server
  app.configure(feathers.socketio(socket));

  // Event Listeners
  const currentView = document.getElementById("current-view");
  const clientToggle = document.getElementById("client-toggle");
  const clientRate = document.getElementById("client-rate");
  const throttleDropDown = document.getElementById("throttle-dropdown");
  const uploadThrottleUp = document.getElementById("upload-throttle-up");
  const uploadThrottleDown = document.getElementById("upload-throttle-down");
  const downloadThrottleUp = document.getElementById("download-throttle-up");
  const downloadThrottleDown = document.getElementById(
    "download-throttle-down"
  );
  const upMax = document.getElementById("upload-throttle");
  const downMax = document.getElementById("download-throttle");
  const torrentRows = document.querySelectorAll(".torrent-row");

  clientToggle.addEventListener("submit", toggleClient);
  uploadThrottleUp.addEventListener("submit", throttleUploadUp);
  uploadThrottleDown.addEventListener("submit", throttleUploadDown);
  downloadThrottleUp.addEventListener("submit", throttleDownloadUp);
  downloadThrottleDown.addEventListener("submit", throttleDownloadDown);
  torrentRows.forEach((row) => {
    row.childNodes[9].childNodes[3].childNodes[3].childNodes[1].addEventListener(
      "click",
      toggleTorrent
    );
  });
  const torrentControls = document.querySelectorAll(".torrent-controls");
  torrentControls.forEach((torrentControl) => {
    torrentControl.addEventListener("click", (e) => e.stopPropagation());
  });

  throttleDropDown.addEventListener("click", (e) => e.stopPropagation());

  // Initialize services
  init();

  /*
   * Front End Updaters
   */
  async function renderClientRate() {
    await app.service("client-services").update(clientRate.id, clientRate);
    const clientStatus = await app.service("client-services").find();
    const upRate = clientStatus.currentUploadRate;
    const downRate = clientStatus.currentDownloadRate;
    clientRate.innerHTML = `${(upRate / 1000).toFixed(2)}/${(
      downRate / 1000
    ).toFixed(
      2
    )}<small>KB/s <i class="bi bi-arrow-up px-0"></i><i class="bi bi-arrow-down px-0"></i></small>`;
  }

  async function renderClientPausedStatus() {
    const clientStatus = await app.service("client-services").find();
    if (clientStatus.paused) {
      torrentRows.forEach((row) => {
        row.className =
          "torrent-row paused container d-flex flex-row justify-content-between align-items-center  py-1 my-3 w-100";
        row.childNodes[9].childNodes[3].childNodes[3].childNodes[1].childNodes[1].innerHTML = `<i class="bi bi-play-circle-fill"></i><small>Resume</small>`;
        row.childNodes[3].innerHTML = `<span class="fs-5">Paused</span>`;
        row.style.backgroundColor = "rgba(190, 190, 190, .5)";
      });

      clientToggle.childNodes[3].innerHTML = "<i class='bi bi-play'></i>";
    } else {
      torrentRows.forEach((row) => {
        row.className =
          "torrent-row container d-flex flex-row justify-content-between align-items-center  py-1 my-3 w-100";
        row.childNodes[9].childNodes[3].childNodes[3].childNodes[1].childNodes[1].innerHTML = `<i class="bi bi-pause-circle-fill"></i><small>Pause</small>`;
        row.style.backgroundColor = "#fcfbf7";
      });
      clientToggle.childNodes[3].innerHTML = "<i class='bi bi-pause'></i>";
    }
  }

  async function renderTorrentUpdates() {
    await app.service("torrent-services").update("all", torrentRows);
    const torrents = await app.service("torrent-services").find(null);
    torrentRows.forEach((row) => {
      torrents.forEach((torrent) => {
        if (torrent.id == row.id) {
          // row.childNodes[row.childNodes.length - 6].childNodes[0].data =
          //    `${torrent.peerCount}`;
          row.childNodes[9].childNodes[3].childNodes[1].childNodes[1].innerHTML = `${(
            torrent.currentUploadSpeed / 1000
          ).toFixed(2)}KB/s
                       <i class="bi bi-arrow-up"></i>`;
          row.childNodes[9].childNodes[3].childNodes[1].childNodes[5].innerHTML = `${(
            torrent.currentDownloadSpeed / 1000
          ).toFixed(2)}KB/s
                       <i class="bi bi-arrow-down"></i>`;
          if (!torrent.paused) {
            if (torrent.done == false) {
              row.childNodes[3].innerHTML = `<span class="fs-5 p-0 mx-0">${(
                torrent.progress * 100
              ).toFixed(2)}%</span>`;
            } else {
              row.childNodes[3].outerHTML = `<div class="ps-2 pe-3 pt-1 mx-1"><i class="bi bi-check-circle-fill"></i></div>`;
            }
          }
        }
      });
    });
  }

  async function changeTorrentPausedStatus(row, currentData) {
    //band-aid
    if (currentData.paused) {
      row.className =
        "torrent-row paused container d-flex flex-row justify-content-between align-items-center  py-1 my-3 w-100";
      row.childNodes[9].childNodes[3].childNodes[3].childNodes[1].childNodes[1].innerHTML = `<i class="bi bi-play-circle-fill"></i><small>Resume</small>`;
      row.childNodes[3].innerHTML = `<span class="fs-5 p-0">Paused</span>`;
      row.style.backgroundColor = "rgba(190, 190, 190, .5)";
    } else {
      row.className =
        "torrent-row container d-flex flex-row justify-content-between align-items-center  py-1 my-3 w-100";
      row.childNodes[9].childNodes[3].childNodes[3].childNodes[1].childNodes[1].innerHTML = `<i class="bi bi-pause-circle-fill"></i><small>Pause</small>`;
      row.style.backgroundColor = "#fcfbf7";
    }
  }

  // Upload limit updater
  async function renderNewUploadLimit() {
    const clientStatus = await app.service("client-services").find();
    upMax.innerHTML = `${clientStatus.maxUploadRate / 1000}<small>KB/s</small>`;
  }

  //Download limit updater
  async function renderNewDownloadLimit() {
    const clientStatus = await app.service("client-services").find();
    downMax.innerHTML = `${clientStatus.maxDownloadRate / 1000
      }<small>KB/s</small>`;
  }

  /*
   * Backend Services
   */

  // Toggle client pause or resume
  async function toggleClient(e) {
    e.preventDefault();
    await app.service("client-services").update(e.srcElement.id, clientToggle);
    const clientStatus = await app.service("client-services").find();
    const data = await app.service("torrent-services").find(null);
    data.forEach(async (torrent) => {
      torrent.paused = clientStatus.paused;
      await app.service("torrent-services").update("torrent-toggle", torrent);
    });
    renderClientPausedStatus();
  }

  // Toggle torrent pause or resume
  async function toggleTorrent(e) {
    e.preventDefault();
    const clientStatus = await app.service("client-services").find();
    //band-aid
    const torrentRow =
      e.srcElement.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement;
    const id = torrentRow.id;
    const torrentsArray = await app.service("torrent-services").find(null);
    const data = await torrentsArray.find((torrent) => torrent.id === id);

    if (!clientStatus.paused) {
      data.paused = data.paused ? false : true;
      await app.service("torrent-services").update("torrent-toggle", data);
      changeTorrentPausedStatus(torrentRow, data);
    }
  }

  async function throttleUploadUp(e) {
    e.preventDefault();
    await app
      .service("client-services")
      .update(e.srcElement.id, uploadThrottleUp);
    renderNewUploadLimit();
  }

  async function throttleUploadDown(e) {
    e.preventDefault();
    await app
      .service("client-services")
      .update(e.srcElement.id, uploadThrottleDown);
    renderNewUploadLimit();
  }

  async function throttleDownloadUp(e) {
    e.preventDefault();
    await app
      .service("client-services")
      .update(e.srcElement.id, downloadThrottleUp);
    renderNewDownloadLimit();
  }

  async function throttleDownloadDown(e) {
    e.preventDefault();
    await app
      .service("client-services")
      .update(e.srcElement.id, downloadThrottleDown);
    renderNewDownloadLimit();
  }

  async function init() {
    currentView.innerText =
      window.location.pathname.split("/").pop() !== "dashboard"
        ? window.location.pathname.split("/").pop()
        : "all";
    await app
      .service("client-services")
      .create(document.getElementById("torrent-table"));
    torrentRows.forEach(async (row) => {
      await app.service("torrent-services").create({ id: row.id });
    });
    await app.service("torrent-services").remove(null);

    setInterval(renderTorrentUpdates, 1000);
    setInterval(renderClientRate, 500);
  }
}

export { startDashboardServices };
