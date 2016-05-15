var http = require('http');
var url = require('url');
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

function handleRequest(request, response){
  var queryData = url.parse(request.url, true).query;

  response.end('It Works!!');
  if(!queryData.code){
    return;
  }

  utils.getToken(config.slack_api.id, config.slack_api.secret, queryData.code)
    .then(function(res){
      if(res.access_token){
        var plugins = config.plugins;
        plugins['hermes-slack'].token = res.bot.bot_access_token;
        hermesLoad(config.name, config.nickname, plugins);
      };
    });
}

var server = http.createServer(handleRequest);
var PORT = process.env.PORT || 8080;

server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});
