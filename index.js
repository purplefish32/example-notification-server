// Setup basic express server
var express        = require('express');
var app            = express();
var server         = require('http').createServer(app);
var io             = require('socket.io')(server);
var port           = process.env.PORT || 3000;
var bodyParser     = require('body-parser');
var md5            = require('MD5');
var authorisedApps = {"app": "1234", "app2": "1235"};
var channels       = null;

app.use(bodyParser.json()); 

server.listen(port);

io.on('connection', function (socket) {
  console.log("Connection");
  
  var ns = socket.handshake.query.ns;
  
  console.log('connected ns: ' + ns)

  if (socket.handshake.query.channels) {
    channels = socket.handshake.query.channels.split(',');
    channels.forEach(function(channel) {
      socket.join(channel);
    });
  };

  console.log(authorisedApps);
});

app.post('/apps/:app_id/events', function(req, res) {
  var name           = req.body.name;
  var channel        = req.body.channel;
  var data           = req.body.data;
  var bodyMd5        = req.query.body_md5;
  var authVersion    = req.query.auth_version;
  var authKey        = req.query.auth_key;
  var authTimestamp  = req.query.auth_timestamp;
  var authSignature  = req.query.auth_signature;
  var appId          = req.params.app_id;

  res.setHeader('Content-Type', 'application/json');

  console.log(req.query);
  console.log(authKey);
  console.log(authorisedApps.indexOf(authKey));
  
  if (authorisedApps.indexOf(authKey) === -1) {
    res.send('{error: "Not Authorized"}'); //status ?? 403 ??
  } else {

    io.of('/' + appId).in(channel).emit(name, data);

    res.send('{}'); // 200 status ?
  }

});

app.get('/channels', function(req, res) {
  // Needs 200 status and json encoded response
  res.send('{}');
});

app.get('/channels/:channel', function(req, res) {
  // Needs 200 status and json encoded response
  res.send('{}');
});

app.get('/', function(req, res) {
  // Needs 200 status and json encoded response
  //params array API params (see http://pusher.com/docs/rest_api)
  res.send('{}');
});

function isAuthorizedApp(appId) {
  if (authorisedApps.indexOf(appId) === -1) {
    return false; 
  };
  return true; 
};

//Join / unjoin api ?