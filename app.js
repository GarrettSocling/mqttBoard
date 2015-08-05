
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
var client  = mqtt.connect('mqtt://'+cfg.mqttClient.host);

client.on('connect', function () {
  mqtt_logger.debug("Mqtt connected: "+cfg.mqttClient.host);
});

// the express stuff
var exp_logger = log4js.getLogger('[express]');
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
// handlebars stuff
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bower
app.use('/bower',  express.static(__dirname + '/views/bower'));

app.get('/', function (req, res) {
  res.render('home');
});

var server = app.listen(cfg.express.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  exp_logger.debug('Example app listening at http://%s:%s', host, port);
});
