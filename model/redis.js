var debug = register('debug')('redis');
var redis = require("redis"),
    client = redis.createClient();

var redis = {};

redis.find = function(jid, cb) {
    client.sismember("user", jid.local, function(err, obj) {
        if(!obj) {
            debug('User found jid:',jid);
            cb(true);
        } 
        else {
            debug('User not found jid:', jid);
            cb(false);
        }
    });
};

redis.registerUser = function(jid, password) {
    debug('registerUser');
    redis.find(jid, function(user) {
        if(user) {
        	debug('registeration failed. User already exists');
            options.error("There is already a user with that jid");
        } else {
            redis.saveUser(jid,password,function() {
            	debug('Registration success');
                options.success(user);
            });
        }
    });
    
}

redis.saveUser = function(jid,password,callback) {
    debug("saveUser", jid);
    client.sadd("user", jid, function(err, obj) {
        callback(err, this);
    });
};

exports.redis = redis;