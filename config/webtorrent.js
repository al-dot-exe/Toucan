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

// try {
//    if (WebTorrent.WEBRTC_SUPPORT) {
//       console.log('We are rolling with WebRTC!')
//    } else {
//       console.log('No WebRTC support, figure out later');
//    }
// } catch (err) {
//    console.error(err)
//    console.log('Something is going wrong with web torrent rtc support :/')
// }

module.exports = { client };
