var Promise = require('promise');
var request = require('request');
var indent = require('indent');
var chalk = require('chalk');
var format = require('util').format;
var resolve = require('path').resolve;

module.exports = {
  req: req,
  log: log,
  fatal: fatal,
  getToken: getToken
};

function req(str){
  if ('.' == str.charAt(0)) str = resolve(str); // local paths
  try {
    return require(str);
  } catch (e) {
    fatal(e);
  }
};

function log(msg){
  msg = format.apply(null, arguments);
  console.log(chalk.italic.white('   Hermes'), chalk.gray('·'), msg);
}

function fatal(msg){
  if (msg instanceof Error) msg = msg.message + '\n\n' + indent(msg.stack, 12);
  msg = format.apply(null, arguments);
  console.error(chalk.italic.red('   Hermes'), chalk.gray('·'), msg);
  process.exit(1);
}

function getToken(id, secret, code){
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
};
