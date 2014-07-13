var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyBcDCcYsu1bVrBviVSNONxOh01-ywbekO8');
var registrationIds = [];
registrationIds.push('APA91bFUVamBVdJ5zqu4kZjA2YbIIjz0rr-Kw-yN0BO3p0WEz4icL6jzNx9iycMwyLfCcB2VZZ2BIhhjGtZiq2jTDPk6GJYnHZgB59LJkHjLscnM0wut7RfHM41gcW4W0GOcYCHeZ4X3B3gWCQxkLL5j6Skvt4bmXQ');
/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
 **/
sender.send(message, registrationIds, 4, function (err, result) {
    console.log('gcm',err,result);
});

module.exports = sender;