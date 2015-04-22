// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

io.on('connection', function (socket) {

  console.log('Client connected');

  // when the client emits 'notification', this listens and executes
  socket.on('notification', function () {
    // we tell the client to execute 'notification'
    console.log('notif');

    socket.emit('notification', {
      message: 'Message',
      title: 'Title',
      type: 'info',
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log('Client disconnected');
  });
});