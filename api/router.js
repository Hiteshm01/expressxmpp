var debug = require('debug')('router');
var debugManager = require('debug')('routerManager');
var routerManager = {
	registerRoute : function(jid, session){
		debugManager('registerRoute', jid);
	    this.sessions[jid] = client;
	    return true;
	},
	removeRoute : function(jid){
		debugManager('registerRoute', jid);
	    this.sessions[jid] = {};
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
			this.sessions[client.jid.local].send(stanza); 
		});
	});
}
module.exports = router;