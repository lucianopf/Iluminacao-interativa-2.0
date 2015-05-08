
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
  
    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('novoUser', function (usuario) {
      socket.set('usuario', usuario, function (err) {
        updateRoster();
      });
    });
    
    
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('usuario', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    setTimeout(function(){socket.emit(event, data);},150*Object.size(socket.manager.connected));
  });
};

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
