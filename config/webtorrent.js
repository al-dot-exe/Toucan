const Torrent = require('../models/Torrent');
const WebTorrent = require('webtorrent');

//Webtorrent instance
// default instance is optimized for a raspi3
const client = new WebTorrent({
   maxConns: 250,
   dht: false,
   lsd: true,
   downloadLimit: 307200,
   uploadLimit: 529408,

   // the following I am not to familiar with
   webSeeds: true,
   utp: true,
});

const startToucan = async _ => {
   console.log('Starting Toucan Torrent client!');

   console.log('Synchronizing Torrents table...');
   await Torrent.sync();

   console.log('Loading torrents back...');
   const torrents = await Torrent.findAll();
   torrents.forEach(torrent => {
      if (torrent.torrentID.toString().startsWith('magnet')){
         parsedTorrent = torrent.torrentID.toString();
      } else {
         parsedTorrent = torrent.torrentID;
      }
      console.log(`\nTorrent: ${torrent.name}\nInfo Hash: ${torrent.id}`);
      client.add(parsedTorrent, {
         path: 'database/torrents/'
      }, () => {
      });
   });

   console.log("\nChecking for WEBRTC support...");
   try {
      if (client.WEBRTC_SUPPORT) {
         console.log('We are rolling with WebRTC!');
      } else {
         console.log('No WebRTC support');
      }
   } catch (err) {
      console.error(err);
      console.log('Something is going wrong with web torrent rtc support :/');
   }
}


module.exports = { client, startToucan };
