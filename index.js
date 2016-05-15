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

var robot = function(token){
  var plugins = config.plugins;
  plugins['hermes-slack'].token = token;
  hermesLoad(config.name, config.nickname, plugins);
};

var restore = function(){
  utils.getTeams()
    .then(function(teams){
      teams.forEach(function(team){
        utils.dbget(team)
          .then(robot);
      });
    });
};

restore();

function handleRequest(request, response){
  var queryData = url.parse(request.url, true).query;

  response.end('It Works!!');
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
}


var app = express();
app.get('/', function(req, res){
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
