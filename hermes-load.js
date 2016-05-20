var Hermes = require('hermes');
var utils = require('./utils');
var _ = require('lodash');

module.exports = load;
/**
 * Create a new hermes robot with given arguments
 * @param {String} name
 * @param {String} nickname
 * @param {Object} plugins
 * @param {String} template
 */
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

