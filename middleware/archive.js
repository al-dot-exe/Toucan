const fs = require('fs-extra');

module.exports = {
   createTorrentArchive: async (folder, zip) => {
      try {
         const directoryContents = fs.readdirSync(folder, {
            withFileTypes: true
         });
         directoryContents.forEach(({ name }) => {
            const path = `${folder}/${name}`;
            if (fs.statSync(path).isFile()) {
               zip.file(name, fs.readFileSync(path, "utf-8"));
            }
            if (fs.statSync(path).isDirectory()) createTorrentArchive(name, path, zip);
            console.log(`Adding: ${path}`);
         });
      } catch (err) {
         console.error(err);
      }
   }
}

