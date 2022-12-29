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
      console.info(`Generating ${folderName}.zip...`);

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
        console.info(`Adding ${name} to ${folderName}.zip...`);
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

      console.info(`\nZipping ${folderName}.zip, this may take a while...`);
      archive.on("progress", async (progress) => {
        await progress.entries.processed % 10 === 0
          ? console.info(
            `${Math.round(
              (progress.entries.processed / progress.entries.total) * 100
            )}%`
          )
          : process.stdout.write(
            `${Math.round(
              (progress.entries.processed / progress.entries.total) * 100
            )}% `
          );
      });
      archive.finalize();
    } catch (err) {
      console.error(err);
    }
  },
};
