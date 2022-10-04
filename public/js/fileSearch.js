import { Autocomplete } from "./autocomplete.js";

("use strict");

async function startFileSearchServices() {
  // Declare web sockets
  const socket = io(`https://0.0.0.0:3131/`, {});

  // Init feathers app
  const app = feathers();

  // Register socket.io to talk to server
  app.configure(feathers.socketio(socket));

  // Select DOM items and Event Listeners
  const torrentSearch = document.getElementById("torrent-search-input");

  async function init() {
    await app.service("file-search-services").create({ null: null });
    const torrentFolders = await app.service("file-search-services").find();
    let folderNames = [];

    torrentFolders.forEach((folder) => {
      const folderUnit = {
        label:
          folder.folderPath.split(".").pop() === "zip"
            ? folder.folderPath.slice(0, -4).split("/").pop()
            : folder.folderPath.split("/").pop(),
        value: folder.id,
      };
      folderNames.push(folderUnit);
    });

    const autocomplete = new Autocomplete(torrentSearch, {
      data: folderNames,
      maximumItems: 5,
      onSelectItem: ({ label, value }) => {
        window.location.assign(`https://0.0.0.0:3131/torrents/${value}`);
      },
    });
  }

  // Initialize File Search
  init();
}

export { startFileSearchServices };
