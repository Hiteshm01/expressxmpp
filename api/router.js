var debug = require('debug')('router');
var debugManager = require('debug')('routerManager');
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
		debugManager('registerRoute', jid);
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
			self.sessions[client.jid.local].send(stanza); 
		});
	});
}
module.exports = router;