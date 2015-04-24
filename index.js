// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser')

app.use( bodyParser.json() ); 

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.post('/apps/:app_id/events', function(req, res) {

  var channels = req.body.channels;
  var name = req.body.name;
  var data = req.body.data;

  if (channels) {  
    channels.forEach(function(room){
      io.sockets.in(room).emit(name, data);
    });
  } else {
    io.emit(name, data);
  }

  //TODO better response
  res.setHeader('Content-Type', 'application/json');
  res.send('{}');
});

io.on('connection', function (socket) {
  console.log('Client connected');

  var subscriptions = socket.handshake.query.channels.split(',');

  // Join rooms
  subscriptions.forEach(function(room){
    socket.join(room);
    console.log("Joined : " + room);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log('Client disconnected');
  });
});