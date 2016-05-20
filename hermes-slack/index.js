var SlackClient = require('@slack/client');
var RtmClient = SlackClient.RtmClient;
var CLIENT_EVENTS = SlackClient.CLIENT_EVENTS;
var RTM_EVENTS = SlackClient.RTM_EVENTS;
var MemoryDataStore = SlackClient.MemoryDataStore;
var _ = require('lodash');

module.exports = plugin;

/**
 * Create a Hermes plugin
 * @param {Object} opts Contains given named arguments list
 * @returns {Object} Hermes plugin
 */
function plugin(opts){
  /**
   * Register plugin's functionality on a given robot
   * @param {Object} robot Hermes robot
   * @returns {Object} Hermes robot
   */
  return function(robot){

    var user = {id: null, name: null, nickname: null};
    /**
     * Check for token in opts. If it doesn't exists, error and exit
     * @returns {String} token
     */
    var token = (function(){
      if(opts['token']){
        return opts['token'];
      } else {
        console.log('Please define token in hermes.json');
        process.exit(1);
      }
    })();

    var rtm = new RtmClient(token, {
      logLevel: 'info', // check this out for more on logger: https://github.com/winstonjs/winston
      dataStore: new MemoryDataStore({}) // pass a new MemoryDataStore instance to cache information
    });

    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
      console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
    });

    /**
     * Connect to Slack's RTM whenever robot issued connect event.
     */
    robot.connect = function(){
      var self = this;

      rtm.start();

      rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
        user.id = rtmStartData.self.id;
        user.name = rtmStartData.self.id;
      });

      rtm.on(RTM_EVENTS.MESSAGE, function(message){
        var mention = new RegExp("<@" + user.id + ">: ", 'ig');
        if(!_.isString(message.text)){return;}
        if(message.text.search(mention) > -1){
          message.text = message.text.replace(mention, '');
          self.emit('mention', message.text, message);
        } else {
          self.emit('message', message);
        }
      });
    };

    /**
     * Make robot able to speak
     * @param {String} msg
     * @param {Object} ctx The target channel context
     */
    robot.say = function(msg, ctx){
      rtm.sendMessage(msg, ctx.channel, function(){
        console.log('Message sent');
      });
    };

    /**
     * Reply to someone with id
     * @param {String} id
     * @param {String} msg
     * @param {Object} ctx The message target context
     */
    robot.replay = function(id, msg, ctx){
      var user = robot.user(id);
      var mention = robot.mention(user.nickname);
      msg = mention + ' ' + msg;
      robot.say(msg);
    };
  };
}
