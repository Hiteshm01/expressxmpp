var debug = require('debug')('blinder');
var redis = require('../model/redis');

function blinder(server) {
	server.on('connect', function (client) {
		client.on('stanza', function (stanza) {
			debug('stanza');

			//TODO:
			/*
				if to is blank, find a blinder among free logged in users.
			*/
			if(!stanza.attrs.to){
				redis.findRandomUser(stanza.attrs.from, function(err, res){
					stanza.attrs.to = res;
				});
			}
		});
	});
}
module.exports = blinder;