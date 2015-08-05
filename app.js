
// well we need som logging
var log4js = require('log4js');
var logger = log4js.getLogger();

// load the cfg
var cfg = require('./config.json');

// debug the config
logger.debug(cfg);

// init the mqtt client
var mqtt_logger = log4js.getLogger('[mqtt]');
var mqtt    = require('mqtt');
var panels_cfg = require('./panels.json');
var client  = mqtt.connect('mqtt://'+cfg.mqttClient.host);
client.on('connect', function () {
  mqtt_logger.debug("Mqtt connected: "+cfg.mqttClient.host);
  for (var panel in panels_cfg.panels) {
    var topic = panels_cfg.panels[panel].toppic;
    mqtt_logger.debug("Subscribing to: "+topic)
    client.subscribe(topic);
  }
});

client.on('message', function (topic, message) {
  // message is Buffer
  mqtt_logger.debug("Got message on: "+topic)
  console.log(message.toString());
  io.emit('topicData', { "topic": topic, "time" : new Date().getTime() , "payload" : message.toString()});
});

// the express stuff
var exp_logger = log4js.getLogger('[express]');
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

// io
var io_logger = log4js.getLogger('[socket io]');
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  io_logger.debug("Got connection from: "+socket.id);
});

// handlebars stuff
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bower
app.use('/bower',  express.static(__dirname + '/views/bower'));
app.use('/public',  express.static(__dirname + '/views/public'));

app.get('/', function (req, res) {
  res.render('home');
});

server.listen(cfg.express.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  exp_logger.debug('Example app listening at http://%s:%s', host, port);
});
