var Promise = require('promise');
var request = require('request');
var indent = require('indent');
var chalk = require('chalk');
var format = require('util').format;
var resolve = require('path').resolve;

var redis_host = process.env.REDIS_HOST || 'localhost';
var redis = require('redis').createClient(6379, redis_host);

module.exports = {
  req: function(str){
    if ('.' == str.charAt(0)) str = resolve(str); // local paths
    try {
      return require(str);
    } catch (e) {
      fatal(e);
    }
  },

  log: function(msg){
    msg = format.apply(null, arguments);
    console.log(chalk.italic.white('   Hermes'), chalk.gray('·'), msg);
  },

  fatal: function(msg){
    if (msg instanceof Error) msg = msg.message + '\n\n' + indent(msg.stack, 12);
    msg = format.apply(null, arguments);
    console.error(chalk.italic.red('   Hermes'), chalk.gray('·'), msg);
    process.exit(1);
  },

  getToken: function(id, secret, code){
    var form = {
      'client_id': id,
      'client_secret': secret,
      'code': code
    };

    return new Promise(function(fullfill, reject){
      request.post(
        {url:'https://slack.com/api/oauth.access', form: form},
        function(err, httpResponse, body){
          if(err) reject(err);
          fullfill(JSON.parse(body));
        });
    });
  },

  getTeams: function(){
    return new Promise(function(fullfill, reject){
      redis.keys('TEAM_*', function(err, res){
        if(err) reject(err);
        fullfill(res);
      });
    });
  },

  setTeam: function(teamid, token){
    return this.dbset(`TEAM_${teamid}`, token);
  },

  dbset: function(key, value){
    return new Promise(function(fullfill, reject){
      redis.set(key, value, function(err, res){
        if(err) reject(err);
        fullfill(res);
      });
    });
  },

  dbget: function(key){
    return new Promise(function(fullfill, reject){
      redis.get(key, function(err, res){
        if(err) reject(err);
        fullfill(res.toString());
      });
    });
  }
};
