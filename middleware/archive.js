("use strict");
const fs = require("fs-extra");

module.exports = {
  createTorrentArchive: async (
    folderPath,
    folderName,
    writeStream,
    archive
  ) => {
    try {
      console.log(`Generating ${folderName}.zip...`);

      archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
          console.info("Received ENOENT error");
        } else {
          throw err;
        }
      });

      archive.on("error", (err) => {
        throw err;
      });

      // pipe writestream to archive to the adding files
      archive.pipe(writeStream);

      const folder = fs.readdirSync(folderPath, {
        withFileTypes: true,
      });

      folder.forEach(async ({ name }) => {
        console.log(name);
        const filePath = `${folderPath}/${name}`;
        if (fs.statSync(filePath).isFile()) {
          // handle files with a read stream
          const fileStream = fs.createReadStream(filePath);
          await archive.append(fileStream, { name: name });
        }
        if (fs.statSync(filePath).isDirectory()) {
          // handles directories
          await archive.directory(filePath, name);
        }
      });

      console.log("Finalizing torrent archive...");
      archive.finalize();
    } catch (err) {
      console.error(err);
    }
  },
};
