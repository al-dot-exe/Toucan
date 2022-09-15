// custom client side js goes here
let torrentFile = document.getElementById("dot-torrent").files[0];
let formData = new FormData();
     
formData.append(".torrent", torrentFile);
fetch('/torrents/add', {method: "POST", body: formData});
