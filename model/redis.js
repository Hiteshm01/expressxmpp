var debug = require('debug')('redis');
var redis = require("redis"),
	client = redis.createClient();

var redisModel = {};

redisModel.findUser = function (jid, cb) {
	client.sismember("user", jid.local, function (err, obj) {
		if (!obj) {

			debug('User not found jid:', jid);
			cb(err);
		} else {
			debug('User found jid:', jid);
			cb(null, obj);
		}
	});
};

redisModel.registerUser = function (jid, password, options) {
	debug('registerUser');
	redisModel.findUser(jid, function (err, res) {
		if (!err && res) {
			debug('registeration failed. User already exists');
			options.error("There is already a user with that jid");
		} else {
			redisModel.saveUser(jid, password, function () {
				debug('Registration success');
				options.success(jid);
			});
		}
	});

}

redisModel.saveUser = function (jid, password, callback) {
	debug("saveUser", jid);
	client.sadd("user", jid, function (err, obj) {
		callback(err, this);
	});
};

redisModel.findBlinder = function (jid, cb) {
	debug('findBlinder');
	client.smembers(jid, function (err, obj) {
		if (!obj) {
			debug('blinder not found jid:', jid);
			cb(err);
		} else {
			debug('blinder found jid:', jid);
			cb(null, obj);
		}
	});
}
redisModel.registerBlinder = function (jid1, jid2, cb) {
	debug('registerBlinder');
	client.sadd(jid1, jid2, function (err, obj) {
		if (!err) {
			debug('registerBlinder: success');
			cb(null);
		} else {
			debug('registerBlinder: failed');
			cb(err);
		}
	});
}

redisModel.findRandomUser = function (currjid, cb) {
	var trycount = 0;
	var timer;
	client.srandmember("user", function (err, res) {
		if (!err) {
			redisModel.findBlinder(res, function(err, obj){
				if(!err)
					next(res);
				else if (res != currjid.split('@')[0]) {
					debug('random user found', res)
					return cb(null, res);
				} else {
					timer = setInterval(function () {
						client.srandmember("user", function (err, res) {
							debug('trycount', trycount);
							next(res);
						});
					}, 10);
				}
			});
		} else
			cb(err)
	});

	function next(res) {
		trycount++;
		if (trycount > 3) {
			clearInterval(timer);
			return cb(null, 'fail case');
		}
		if (res != currjid) {
			clearInterval(timer);
			return cb(null, res);
		} else {
			debug('failed attempt, retrying', trycount);
		}
	}
}


module.exports = redisModel;


(function () {
	if (require.main === module) {
		redisModel.registerBlinder(123, 456, console.log);
		redisModel.findBlinder(123, console.log)
	}
}());