var debug = require('debug')('router');
var debugManager = require('debug')('routerManager');
var ltx = require('ltx');
var self = this;
var redis = require('../model/redis');

var routerManager = {
	registerRoute : function(jid, client){
		debugManager('registerRoute', jid);
		if(!self.sessions)
			self.sessions = [];
	    self.sessions[jid] = client;
	    return true;
	},
	removeRoute : function(jid){
		debugManager('removeRoute', jid);
	    self.sessions[jid] = {};
	    return true;
	},
	findRoute : function(stanza){
		var pong = new ltx.Element('iq', {from: stanza.attrs.to, to: stanza.attrs.from, id: stanza.attrs.id, type: 'result'});
			// client.send(stanza); 
			
			if(self.sessions[stanza.attrs.to])
				self.sessions[stanza.attrs.to].send(stanza); 
			else
				debug('FATEL ERROR! Recipient not found in session');
	}
}
function router(server) {
	server.on('connect', function (client) {
		client.on('online', function () {
			debug('online!');
			routerManager.registerRoute(client.jid.local,client);
		});
		client.on('end', function () {
			routerManager.removeRoute(client.jid.local);
			debug('end');
		});
		client.on('stanza', function (stanza) {
			debug('stanza');
			if(!stanza.attrs.to){
				redis.findRandomUser(stanza.attrs.from, function(err, res){
					stanza.attrs.to = res;
					findRoute(stanza)
				});
			}
			else
				findRoute(stanza);
			//TODO:
			/*
				Swap to and from jids and send stanza.
				Assumption: Blinder has already placed a to id in case it was blank. if to is blank here, something needs a fix.
			*/
			
		});
	});
}
module.exports = router;