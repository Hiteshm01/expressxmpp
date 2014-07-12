var xmpp = require('node-xmpp');
var path = require('path');
var config = require('jsconfig'),
 defaultConfigPath = path.join(__dirname, "config.js");
config.defaults(defaultConfigPath);

var server = new xmpp.C2SServer(config);

