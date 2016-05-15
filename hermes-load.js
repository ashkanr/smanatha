var chalk = require('chalk');
var Hermes = require('hermes');
var indent = require('indent');
var format = require('util').format;
var utils = require('./utils');
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
      var plugin = utils.req(name);
      hermes.use(plugin(options));
    });
  }

  hermes.connect();
};

