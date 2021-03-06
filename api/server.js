var xmpp = require('node-xmpp');
var path = require('path');
var debug = require('debug')('server');
var config = require('jsconfig'),
	defaultConfigPath = path.join(__dirname, "config.js");
config.defaults(defaultConfigPath);

var server = new xmpp.C2SServer(config);

var blinder = require('./blinder')(server);
var router = require('./router')(server);
var users = require('./users')(server);
var roster = require('./roster')(server);
var offline_store = require('./offline_store')(server);

server.on("connect", function (client) {
	debug('Server Connected');
});