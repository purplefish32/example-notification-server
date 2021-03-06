// Setup basic express server
var express    = require('express');
var app        = express();
var server     = require('http').createServer(app);
var io         = require('socket.io')(server);
var port       = process.env.PORT || 3000;
var bodyParser = require('body-parser')

app.use(bodyParser.json()); 

server.listen(port);

io.on('connection', function (socket) {
  console.log('Connection');
  var channels = socket.handshake.query.channels.split(',');

  channels.forEach(function(channel){
    console.log('Join chanel : ' + channel);
    socket.join(channel);
  });
});

app.post('/apps/:app_id/events', function(req, res) {
  console.log('Recieve post request');
  var channels = req.body.channels;
  var name     = req.body.name;
  var data     = req.body.data;

  console.log('Broadcast');
  if (channels) {  
    channels.forEach(function(channel){
      io.sockets.in(channel).emit(name, data);
    });
  } else {
    io.emit(name, data);
  }

  res.setHeader('Content-Type', 'application/json');
  res.send('{}');
});