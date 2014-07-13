var debug = require('debug')('redis');
var redis = require("redis"),
    client = redis.createClient();

var redisModel = {};

redisModel.findUser = function(jid, cb) {
    client.sismember("user", jid.local, function(err, obj) {
        if(!obj) {
            debug('User found jid:',jid);
            cb(null,obj);
        } 
        else {
            debug('User not found jid:', jid);
            cb(err);
        }
    });
};

redisModel.findRandomUser = function(currjid, cb){
	var trycount = 0;
    var timer;
    client.srandmember("user",function(err,res){
        if(!err){
            if(res != currjid)
            	debug('random user found', res)
                return cb(null,res);
            else{
                timer = setInterval(function () {
                    client.srandmember("user",function(err, res){
                        debug('trycount',trycount);
                        next(res);
                    });
                }, 10);
            }
        }
        else
            cb(err)
    });

    function next(res){
        trycount++;
        if(trycount > 3){
            clearInterval(timer);
            return cb(null,'fail case');
        }
        if(res != currJid )
        {
             clearInterval(timer);
             return cb(null, res);
        }
        else{
            debug('failed attempt, retrying', trycount);
        }
    }
}

redisModel.registerUser = function(jid, password) {
    debug('registerUser');
    redisModel.findUser(jid, function(err,res) {
        if(!err) {
        	debug('registeration failed. User already exists');
            options.error("There is already a user with that jid");
        } else {
            redisModel.saveUser(jid,password,function() {
            	debug('Registration success');
                options.success(user);
            });
        }
    });
    
}

redisModel.saveUser = function(jid,password,callback) {
    debug("saveUser", jid);
    client.sadd("user", jid, function(err, obj) {
        callback(err, this);
    });
};

module.exports = redisModel;
