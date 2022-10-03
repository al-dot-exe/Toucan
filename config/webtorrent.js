const Torrent = require("../models/Torrent");
const Client = require("../models/Client");
const WebTorrent = require("webtorrent");

// Create initial Webtorrent instance
const client = new WebTorrent();

const startToucan = async () => {
  console.log("\nStarting Toucan Torrent client!");

  // Load client settings first
  // Default settings are optimized for a raspi 3 seedbox
  try {
    console.log("\nLoading Toucan client settings back...");
    clientRecord = await Client.findOrCreate({ where: { id: 0 } });
    console.log("\nApplying saved settings to client...");

    clientRecord = clientRecord[0];
    console.log(clientRecord);

    client.throttleUpload(clientRecord.uploadLimit);
    client.throttleDownload(clientRecord.downloadLimit);
    client.maxConns = clientRecord.maxConns;
    client.webSeeds = clientRecord.webSeeds;
    client.tracker = clientRecord.tracker;
    client.blockList = clientRecord.blockList;
    client.dht = clientRecord.dht;
    client.lsd = clientRecord.lsd;

    // This is REALLY ugly but the only way right now until this is offered in the API
    client.maxUpRate = clientRecord.uploadLimit;
    client.maxDownRate = clientRecord.downloadLimit;

    //getters and setters for Upload rate max
    client.getUploadLimit = () => client.maxUpRate;
    client.setUploadLimit = (n) => {
      client.maxUpRate = n + client.maxUpRate < -1 ? -1 : client.maxUpRate + n;
      client.throttleUpload(client.getUploadLimit());
    };

    //getters and setters for Download rate max
    client.getDownloadLimit = () => client.maxDownRate;

    client.setDownloadLimit = (n) => {
      client.maxDownRate =
        n + client.maxDownRate < -1 ? -1 : client.maxDownRate + n;
      console.log(client.getDownloadLimit());
      client.throttleDownload(client.getDownloadLimit());
    };

    console.log("\nAll client settings loaded normally");
  } catch (err) {
    console.log(
      "\nIt looks like there was an error while loading the client settings <.<"
    );
    console.error(err);
  }

  // Load Torrents back
  try {
    console.log("\nLoading torrents back...");
    const torrents = await Torrent.findAll();
    torrents.forEach((torrent) => {
      if (torrent.torrentID.toString().startsWith("magnet")) {
        parsedTorrent = torrent.torrentID.toString();
      } else {
        parsedTorrent = torrent.torrentID;
      }
      console.log(`\nTorrent: ${torrent.name}\nInfo Hash: ${torrent.id}`);
      console.log(torrent.folderPath);
      client.add(
        parsedTorrent,
        {
          path: `database/torrents/${torrent.category}`
        },
        () => { }
      );
    });

    torrents.length > 0
      ? console.log("\nGrabbed all torrents")
      : console.log("\nNo torrents in database yet");
  } catch (err) {
    console.log(
      "\nIt looks like there was an error while loading the Torrents back <.<"
    );
    console.error(err);
  }
};

module.exports = { client, startToucan };
