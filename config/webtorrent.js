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
   // utp: true, // this didn't work for ubuntu iso and don't know why ???
});

// This is REALLY ugly but the only way right now until this is offered in the API
client._uploadLimit = 529408;
client._downloadLimit = 307200;

//getters and setters for Upload rate max
client.getUploadLimit = () => client._uploadLimit;
client.setUploadLimit = (n) => {
  client._uploadLimit = (n + client._uploadLimit < -1)
  ?  -1
  : client._uploadLimit + n;
}

//getters and setters for Download rate max
client.getDownloadLimit = () => client._downloadLimit;
client.setDownloadLimit = (n) => {
  client._downloadLimit = (n + client._downloadLimit) < -1 
  ?  -1
  : client._downloadLimit + n;
}

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
