var xmpp = require('node-xmpp');
var path = require('path');
var config = require('jsconfig'),
 defaultConfigPath = path.join(__dirname, "config.js");
config.defaults(defaultConfigPath);

var router = require('./router');
var users = require('./users');
var blinder = require('./blinder');

var server = new xmpp.C2SServer(config);

server.on("connect", function(client){
	console.log('Server Connection :', client);
});
