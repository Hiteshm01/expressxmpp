var debug = require('debug')('message');
var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    debug('error');
    console.log("Redis connection error to " + client.host + ":" + client.port + " - " + err);
});

var Message = function(jid, stanza) {
    this.stanza = stanza;
    this.jid = jid;
};

Message.per_jid = 10;

Message.key = function(jid) {
    debug('key', jid);
    return "offline:" + jid.toString();
};

Message.for = function(jid, cb) {
    debug('for', jid);
    Message.nextFor(jid, cb);
};

Message.nextFor = function(jid, cb) {
    debug('nextFor');
    client.rpop(Message.key(jid), function(error, stanza) {
        if(stanza) {
            cb(new Message(jid, stanza));
            Message.nextFor(jid, cb);
        }
    });
};

Message.prototype.save = function(callback) {
    debug('save');
    var self = this;
    client.lpush(Message.key(self.jid), this.stanza, function() {
        client.ltrim(Message.key(self.jid), 0, Message.per_jid-1, function() {
            callback(self);
        });
    });
};

exports.Message = Message;

function isEmpty(ob){
   for(var i in ob){ if(ob.hasOwnProperty(i)){return false;}}
  return true;
}

/* ------------- Main Method ------------------ */

(function () {
    if (require.main === module) {
        Message.for('fd7c97bb0ffe9d1a',console.log);
    }
}());
