// Services to give real time torrent file queries
const Torrent = require("../models/Torrent");

class FileSearchServices {
  constructor() {
    this.torrentFolders = [];
  }

  async create(data) {
    if (this.torrentFolders.length === 0) {
      try {
        let torrentRecords;
        do {
          // loop to ensure the torrent records are all grabbed before its service is created
          torrentRecords = await Torrent.findAll();
        } while (torrentRecords === null);
        torrentRecords.forEach((record) => {
          this.torrentFolders.push({
            id: record.id,
            folderPath: record.folderPath,
          });
        });
      } catch (err) {
        console.log("Error when creating a file search service");
        console.error(err);
      }
    }
  }

  async find() {
    try {
      return this.torrentFolders;
    } catch (err) { }
  }

  async update(elementId, data) {
    try {
    } catch (err) {
      console.error(err);
      console.log(
        "Something went wrong when trying to retrieve torrent folders"
      );
    }
  }

  async get(torrentID) {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  async remove(params) {
    try {
    } catch (err) {
      console.error(err);
      console.log("Something went wrong when trying to remove torrent folders");
    }
  }
}

const serviceFileSearch = new FileSearchServices();
module.exports = serviceFileSearch;
