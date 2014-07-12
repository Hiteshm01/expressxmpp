var debug = require('debug')('blinder');
function blinder(server) {
	server.on('connect', function (client) {
		client.on("authenticate", function (opts, cb) {
			debug('authenticate');
			cb(null, opts);
		});
		client.on("register", function (opts, cb) {
			debug('register');
		});
	});
}
module.exports = blinder;