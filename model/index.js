var dbmasterconf = require('./db_config');

var alldb = {
  db: require('./db')(dbmasterconf),
  configure : function(key, options){
    var nConfig = {};
    if(this[key] && options){
      ['host','user','password','database'].forEach(function(k){
        if(options[k]){
          nConfig[k] = options[k];
        } else {
          console.log('Insufficient params!');
          return ;
        }
      });
      nConfig['min'] = options['min'] || 2;
      nConfig['max'] = options['max'] || 10;
      this[key] = require('./db')(nConfig);
      return this[key];
    } else {
      console.log('Invalid Key or DB options!');
    }
    return ;
  }
};

module.exports = alldb;
