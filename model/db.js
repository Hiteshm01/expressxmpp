"use strict";

var util = require('util');
var anydbsql = require('anydb-sql');

function configure(config) {
  var dbConfig = { 
                  url: util.format('mysql://%s:%s@%s:3306/%s',
                                    encodeURIComponent(config.user),
                                    encodeURIComponent(config.password),
                                    config.host,
                                    config.database),
                  connections: { min: config.min, max: config.max }
                };

  var db = anydbsql(dbConfig);

  return db;
}


module.exports = configure;
