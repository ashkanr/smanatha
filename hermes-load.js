var chalk = require('chalk');
var Hermes = require('hermes');
var indent = require('indent');
var format = require('util').format;
var _ = require('lodash');

module.exports = load;

function load(name, nickname, plugins, template){
  var hermes = Hermes();

  if (name && _.isString(name))
    hermes.name(name);

  if (nickname && _.isString(nickname))
    hermes.nickname(nickname);

  if (template && _.isString(template))
    hermes.template(template);

  if (plugins && _.isObject(plugins) && !(_.isArray(plugins))){
    Object.keys(plugins).forEach(function(name){
      var options = plugins[name];
      var plugin = req(name);
      hermes.use(plugin(options));
    });
  }

  hermes.connect();
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
