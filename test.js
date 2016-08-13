
// var WebTorrent = require('webtorrent') 

// const sio = require('socket.io')

var http = require("http");
var officegen = require('officegen');

http.createServer ( function ( request, response ) {
  response.writeHead ( 200, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    'Content-disposition': 'attachment; filename=surprise.pptx'
    });

  var pptx = officegen ( 'pptx' );

  pptx.on ( 'finalize', function ( written ) {
      // ...
      });

  pptx.on ( 'error', function ( err ) {
      // ...
      });

  // ... (fill pptx with data)
console.log(1)
  pptx.generate ( response );
}).listen ( 3000 );
// var torrentMap = {}

// sio.listen(8004).sockets.on('connection', function(socket)
// {
//     socket.on('createWebTorrent', function(torrentPath, func)
//     {
//         // torrentPath = this.url = __dirname + '/public/3.torrent'
//         console.log(torrentPath)
//         var client = new WebTorrent()
//         var server , torrent

//         socket.on('disconnect', function(){
//             console.log('disconnect')
//             server.close()
//             client.destroy()
//         })

//         client.add(torrentPath, function (_torrent) {
//             torrent = _torrent
//             server = torrent.createServer()
//             server.listen(8005)
//             var nameList = []
//             torrent.files.forEach(function(file){
//                 nameList.push(file.name)
//             })
//             func(nameList) 
//         })
//     })
// })
