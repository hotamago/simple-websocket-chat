//var express = require('express');
//module.exports = function() {
  //WebSocket
  var WebSocketServer = require('websocket').server;
  var http = require('http');
  var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
  });
  server.listen(3333, function() { });
  // create the server
  wsServer = new WebSocketServer({
    httpServer: server, path: "/wsChat"
  });

  var client = [];

  function sendAllClient(data){
    for(var i = 0; i <client.length; i++) {
      client[i].sendUTF(data);
    }
  }
  function sendAllClientEx(data, id){
    for(var i = 0; i <client.length; i++) {
      if(i != id) client[i].sendUTF(data);
    }
  }

  // WebSocket server
  wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    var index = -1;
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
      if (message.type === 'utf8') {
        var data = JSON.parse(message.utf8Data);
        console.log(message.utf8Data);
        switch (data.type) {
          case 'verify':
            index = client.push(connection) - 1;
            sendAllClient(JSON.stringify({"type": "connections", "count": client.length}));
            break;
          case 'chat':
            if(index == -1){
              connection.sendUTF(JSON.stringify({"type": "error", "message":"Not verified net"}));
            } else {
              sendAllClient(JSON.stringify({"type": "new_chat", "message":data.data}));
            }
            break;
        }
      }
    });

    connection.on('close', function(connection) {
      console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
      client.splice(index, 1);
      sendAllClient(JSON.stringify({"type": "connections", "count": client.length}));
    });
  });
//}