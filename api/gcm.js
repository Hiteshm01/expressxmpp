var gcm = require('node-gcm');
var debug = require('debug')('gcm');
var sender = new gcm.Sender('AIzaSyBcDCcYsu1bVrBviVSNONxOh01-ywbekO8');
var registrationIds = [];
var db = require("../model").db;
registrationIds.push('APA91bFUVamBVdJ5zqu4kZjA2YbIIjz0rr-Kw-yN0BO3p0WEz4icL6jzNx9iycMwyLfCcB2VZZ2BIhhjGtZiq2jTDPk6GJYnHZgB59LJkHjLscnM0wut7RfHM41gcW4W0GOcYCHeZ4X3B3gWCQxkLL5j6Skvt4bmXQ');
/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
 **/
var gcmApi = {
	send: function (message, registrationIds, jid) {
		sender.send(message, registrationIds, 4, function (err, response) {
			console.log('gcm', err, response);
			if (response.canonical_ids) {
				var query = "update users set gcmid = '" + response.results[0].registration_id + "' where jid =  '" + jid + "'";
				db.query(query, function (err, res) {
					debug("canonical_id updated for jid", jid);
				});
			}

		});
	}
}

module.exports = gcmApi;