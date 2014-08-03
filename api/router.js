var debug = require('debug')('router');
var debugManager = require('debug')('routerManager');
var ltx = require('ltx');
var self = this;
var redis = require('../model/redis');
var gcm = require('node-gcm');
var db = require("../model").db;
var gcmApi = require('./gcm');
var util = require('util');
var events = require('events');
var EventEmitter = events.EventEmitter;

// util.inherits(routerManager, EventEmitter);

var routerManager = {
	registerRoute: function (jid, client) {
		debugManager('registerRoute', jid);
		if (!self.sessions)
			self.sessions = [];
		self.sessions[jid] = client;
		return true;
	},
	removeRoute: function (jid) {
		debugManager('removeRoute', jid);
		self.sessions[jid] = {};
		return true;
	},
}


function router(server) {
	server.on('connect', function (client) {
		client.on('online', function () {
			debug('online!');
			routerManager.registerRoute(client.jid.local, client);
		});
		client.on('end', function () {
			routerManager.removeRoute(client.jid.local);
			debug('end');
		});
		var selfie = this;
		client.on('stanza', function (stanza) {
			debug('stanza');

			////////////////////////////////////////////////////
			// routerManager.findRoute(stanza);
			////////////////////////////////////////////////////

			var pong = new ltx.Element('iq', {
				from: stanza.attrs.to,
				to: stanza.attrs.from,
				id: stanza.attrs.id,
				type: 'result'
			});
			// client.send(stanza); 
			var to = stanza.attrs.to;
			if (to) {
				to = stanza.attrs.to.split('@')[0];
				//////GCM//////
				db.query("select gcmid from users where jid = '" + to + "'", function (err, res) {
					if (!err && res.rows[0]) {
						console.log(stanza.children[0].children[0]);
						var message = new gcm.Message({
							collapseKey: 'demo',
							delayWhileIdle: true,
							timeToLive: 3,
							data: {
								MESSAGE: stanza.children[0].children[0],
								LANDING_SCREEN: '2',
								TITLE: 'New Message'
							}
						});
						// var sender = new gcm.Sender('AIzaSyBcDCcYsu1bVrBviVSNONxOh01-ywbekO8');
						var regIds = [];
						debug('sending gcm push to ', res.rows[0].gcmid);
						regIds.push(res.rows[0].gcmid);
						gcmApi.send(message, regIds, to);
					} else
						console.log(err);
				});
				//////GCM//////
				if (self.sessions[to]) {
					self.sessions[to].send(stanza);
				} else{
					selfie.emit("recipientOffline", stanza);
					debug('FATEL ERROR! Recipient not found in session');
				}
			}
		

			////////////////////////////////////////////////////
			//TODO:
			/*
				Swap to and from jids and send stanza.
				Assumption: Blinder has already placed a to id in case it was blank. if to is blank here, something needs a fix.
			*/

		});
	});
}
util.inherits(router, EventEmitter);
module.exports = router;