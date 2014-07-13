var debug = require('debug')('router');
var debugManager = require('debug')('routerManager');
var ltx = require('ltx');
var self = this;
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

			//TODO:
			/*
				Swap to and from jids and send stanza.
				Assumption: Blinder has already placed a to id in case it was blank. if to is blank here, something needs a fix.
			*/
			var pong = new ltx.Element('iq', {from: stanza.attrs.to, to: stanza.attrs.from, id: stanza.attrs.id, type: 'result'});
			// client.send(stanza); 
			self.sessions[stanza.attrs.to].send(stanza); 
		});
	});
}
module.exports = router;