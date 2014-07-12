var debug = require('debug')('users');
var redis = require('../model/redis');

function users(server) {
	server.on('connect', function (client) {
		client.on("authenticate", function (opts, cb) {
			debug('authenticate');
			cb(null, opts);
		});
		client.on("register", function (opts, cb) {
			debug('register');
			redis.registerUser(opts.jid, opts.password, {
				success: function () {
					debug('success');
				},
				error: function () {
					debug('error');
				}

			});
		});
	});
}
module.exports = users;