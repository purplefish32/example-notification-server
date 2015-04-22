// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var MongoWatch = require('mongo-watch');

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

watcher = new MongoWatch({format: 'pretty'});

/*
watcher.watch('heartbeat.ServerData', function(event) {
  console.log('something changed:', event.data.serverId);
});
*/

io.on('connection', function (socket) {

  console.log('Client connected');

  watcher.watch('heartbeat.ServerData', function(event) {

    console.log('EVENT');
    
    console.log(event.data.details);

    var details = JSON.parse(event.data.details);

    console.log('PARSE');

    console.log(details.disk.total);

    console.log('END EVENT');

    emitServerData({
      serverUID:    event.data.serverId,
      diskTotal:    details.disk.total,
      diskUsed:     details.disk.used,
      diskFree:     details.disk.free,
      cpuCount:     details.cpu.count,
      cpuLoadMin1:  details.cpu.load.min1,
      cpuLoadMin5:  details.cpu.load.min5,
      cpuLoadMin15: details.cpu.load.min15,
      memoryTotal:  details.memory.total,
      memoryUsed:   details.memory.used,
      memoryFree:   details.memory.free,
      swapTotal:    details.memory.swap.total,
      swapUsed:     details.memory.swap.used,
      swapFree:     details.memory.swap.free
    });
  });

  // when the client emits 'notification', this listens and executes
  socket.on('notification', function () {
    console.log('On notification');
    emitNotification({
      type: 'info',
      title: 'hi',
      message: 'hi'
    });
  });

  function emitNotification(data) { 
    console.log('Emit notification');
    socket.emit('notification', {
      type: data.type || 'info',
      title: data.title,
      message: data.message
    });
  }

  function emitServerData(data) { 
    console.log('emitting server data');
    console.log(data);
    socket.emit('serverData', {
      serverUID:    data.serverUID    || 'Unknown',
      diskTotal:    data.diskTotal    || 'Unknown',
      diskUsed:     data.diskUsed     || 'Unknown',
      diskFree:     data.diskFree     || 'Unknown',
      cpuCount:     data.cpuCount     || 'Unknown',
      cpuLoadMin1:  data.cpuLoadMin1  || 'Unknown',
      cpuLoadMin5:  data.cpuLoadMin5  || 'Unknown',
      cpuLoadMin15: data.cpuLoadMin15 || 'Unknown',
      memoryTotal:  data.memoryTotal  || 'Unknown',
      memoryUsed:   data.memoryUsed   || 'Unknown',
      memoryFree:   data.memoryFree   || 'Unknown',
      swapTotal:    data.swapTotal    || 'Unknown',
      swapUsed:     data.swapUsed     || 'Unknown',
      swapFree:     data.swapFree     || 'Unknown'
    });
  }

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    console.log('Client disconnected');
  });
});