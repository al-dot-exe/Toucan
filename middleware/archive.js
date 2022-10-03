("use strict");

const JSZip = require("jszip");
const fs = require("fs-extra");

module.exports = {
  createTorrentArchive: async (folderPath, zip) => {
    try {
      const folder = fs.readdirSync(folderPath, {
        withFileTypes: true,
      });
      console.log("\nCreating archive...");
      folder.forEach(async ({ name }) => {
        console.log(name);
        const filePath = `${folderPath}/${name}`;
        if (fs.statSync(filePath).isFile()) {
          const stream = fs.createReadStream(filePath);
          await zip.file(name, stream);
        }
        if (fs.statSync(filePath).isDirectory())
          await createTorrentArchive(filePath, zip);
      });
    } catch (err) {
      console.error(err);
    }
  },
};
