/**
 * @fileOverview Restore registered robots and start a webserver to
 *               register new robots using slack button
 * @name index.js
 * @author 5hah.in
 * @license 
 */
var express = require('express');
var url = require('url');
var path = require('path');
var resolve = require('path').resolve;
var exists = require('fs').existsSync;
var hermesLoad = require('hermes-load');
var utils = require('./utils');

var config = resolve('hermes.json');
if (!exists(config)) utils.fatal('Could not find configuration file at %s', config);

try {
  var config = require(config);
} catch (e) {
  utils.fatal(e);
}

/**
 * Register a new hermes-slack robot for a given toekn.
 * @param {String} token
 */
var robot = function(token){
  var plugins = config.plugins;
  plugins['hermes-slack'].token = token;
  hermesLoad(config.name, config.nickname, plugins);
};

/**
 * Restore all registered robots from their keys in redis database
 */
restore();
var restore = function(){
  utils.getTeams()
    .then(function(teams){
      teams.forEach(function(team){
        utils.dbget(team)
          .then(robot);
      });
    });
};

/** Register the express app */
var app = express();
app.get('/',
        function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/auth/', function(req, res){
  res.redirect('https://my.slack.com');
  var queryData = url.parse(req.url, true).query;

  if(!queryData.code){
    return;
  }

  utils.getToken(config.slack_api.id, config.slack_api.secret, queryData.code)
    .then(function(res){
      if(res.bot){
        token = res.bot.bot_access_token;
        utils.setTeam(res.team_id, token)
          .then(robot(token));
      };
    });

});

var PORT = process.env.PORT || 8080;
app.listen(PORT);
app.use(express.static('public'));
console.log(`Server is listening on http://localhost:${PORT}`);
