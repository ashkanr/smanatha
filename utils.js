var Promise = require('promise');
var request = require('request');
var indent = require('indent');
var chalk = require('chalk');
var format = require('util').format;
var resolve = require('path').resolve;

var redis_host = process.env.REDIS_HOST || 'localhost';
var redis = require('redis').createClient(6379, redis_host);

module.exports = {
  /**
   * Require a module by str. This can be a local or global path.
   *
   * @param {String} str
   * @returns {Mixed}
   */
  req: function(str){
    if ('.' == str.charAt(0)) str = resolve(str); // local paths
    try {
      return require(str);
    } catch (e) {
      this.fatal(e);
    }
  },

  /**
   * Log msg formatted with name to the console.
   * @param {String} msg
   */
  log: function(msg){
    msg = format.apply(null, arguments);
    console.log(chalk.italic.white('   Samantha'), chalk.gray('·'), msg);
  },

  /**
   * Log error message formatted with name to the console and exit.
   * @param {String} msg
   */
  fatal: function(msg){
    if (msg instanceof Error) msg = msg.message + '\n\n' + indent(msg.stack, 12);
    msg = format.apply(null, arguments);
    throw new Error(`${chalk.italic.red('   Samantha')} ${chalk.gray('.')} ${msg}`);
  },

  /**
   * Request permanent access token with a temporary code from slack.
   * @param {String} id Slack App's client_id
   * @param {String} secret Slack App's client_secret
   * @param {String} code The temporary access code
   * @returns {String} The access token
   */
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

  /**
   * Request all registered team tokens from redis.
   * Teams are registered with `TEAM_*` prefix on redis
   *
   * @returns {Promise} Provided by a list of registered team names.
   */
  getTeams: function(){
    return new Promise(function(fullfill, reject){
      redis.keys('TEAM_*', function(err, res){
        if(err) reject(err);
        fullfill(res);
      });
    });
  },

  /**
   * Register a new team to redis database.
   * @param {String} teamid The team id
   * @param {String} token Team's access token
   * @returns {Promise}
   */
  setTeam: function(teamid, token){
    return this.dbset(`TEAM_${teamid}`, token);
  },

  /**
   * Set a key to the value in redis database and return a promise
   * @param {String} key
   * @param {String} value
   * @returns {Promise}
   */
  dbset: function(key, value){
    return new Promise(function(fullfill, reject){
      redis.set(key, value, function(err, res){
        if(err) reject(err);
        fullfill(res);
      });
    });
  },

  /**
   * Get a value with key from redis database and return a promise
   * @param {String} key
   * @returns {Promise} 
   */
  dbget: function(key){
    return new Promise(function(fullfill, reject){
      redis.get(key, function(err, res){
        if(err) reject(err);
        fullfill(res.toString());
      });
    });
  }
};
