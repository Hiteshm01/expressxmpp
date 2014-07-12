var debug = require('debug')('router');
function router(server) {
	server.on('connect', function (client) {
		client.on('online', function () {
			debug('online!');
		});
		client.on('end', function () {
			debug('end');
		});
		client.on('stanza', function (stanza) {
			debug('stanza');
		});
	});
}
module.exports = router;