var debug = require('debug')('roster');
var self = this;
var redis = require('../model/redis');
var gcm = require('node-gcm');
var db = require("../model").db;
var gcmApi = require('./gcm');

function roster(server) {
	server.on('connect', function (client) {

		client.on('stanza', function (stanza) {
			debug('stanza');
			var query = null;
			if (stanza.is('iq') && (query = stanza.getChild('query', "jabber:iq:roster"))) {
				if (stanza.attrs.type === "get") {
					stanza.attrs.type = "result";
					redis.findRandomUser(stanza.attrs.from, function (err, res) {
						debug('Assigning random user with jid: ', res);
						stanza.attrs.to = stanza.attrs.from;
						query.c("item", {
							jid: res,
							name: 'stranger',
							// subscription: item.state
						});
						client.send(stanza);
					});
					// RosterStorage.find(new xmpp.JID(stanza.attrs.from).bare().toString(), function (roster) {
					// 	roster.items.forEach(function (item) {
					// 		query.c("item", {
					// 			jid: item.jid,
					// 			name: item.name,
					// 			subscription: item.state
					// 		});
					// 	});
					// 	stanza.attrs.to = stanza.attrs.from;
					// 	client.send(stanza);
					// });
				}
			}
		});
	});
}
module.exports = roster;