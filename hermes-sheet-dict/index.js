var sheets = require('./sheet');
var _ = require('lodash');

var Data = null;
/**
 * Return a Hermes plugin
 * @param {Object} opts Hermes options.
 * @returns {Object} Hermes plugin.
 */
module.exports = function(opts){
  getData(opts.creds, opts.docid);

  /**
   * Register plugin functionality on a given robot.
   * @param {Object} robot
   */
  return function(robot){
    robot.help('hello', 'Greetings!');
    robot.help('update', 'Update abbreviation data');
    robot.help(['what is <abbreviation>',
                'whatis <abbreviation>',
                'whats <abbreviation>',
                'wtf is <abbreviation>',
                'wtfis <abbreviation>',
                'wtf <abbreviation>'],
               'Translate an abbreviation');

    robot.on('mention', /hello/i, function(res){
      robot.say('Hi, nice to meet you', res.context);
    });

    robot.on('mention', /update/i, function(res){
      getData(opts.creds, opts.docid, function(){
        robot.say("I've updated my data!", res.context);
      });
    });

    // TODO: Better regex
    robot.on('mention', /what ?i?s|wtf ?i?s? (.+)/i, function(res){
      if(!_.isString(res[1])){return;};
      if(res[1].length <= 1){
        robot.say('Invalid query', res.context);
      }
      if(!Data){
        robot.say('Loading...', res.context);
      } else {
        results = search(res[1]);
        if(!results){
          robot.say("No match found!", res.context);
        } else {
          message = format(results);
          robot.say(message, res.context);
        }
      }
    });
  };
};

/**
 * Format a list to a printable message on Slack channel.
 * @param {Array} list
 * @returns {String}
 */
var format = function(list){
  message = '';
  _.forEach(list, function(item){
    message += "✓ *" + item.word + ":* " + item.translation + ".\n";
  });

  return message;
};

/**
 * Search for a given term in data sheet.
 * @param {String} term
 * @returns {Array}
 */
var search = function(term){
  term = _.escapeRegExp(_.unescape(term));

  var matches = _.filter(Data, function(item){
    var regex = new RegExp(term, 'ig');
    if(!item.value) return false;
    return (item.col === 1) && (item.value.search(regex) > -1);
  });

  if (matches.length <= 0){
    return null;
  };

  return matches.map(function(item){
    var translation = _.find(Data, {col: 2, row: item.row});
    return {word: item.value, translation: translation.value};
  });

};

/**
 * Get data from given sheet.
 * @param {Object} creds Google generated credentials
 * @param {String} docid Document id
 * @param {Function} fn Callback function
 */
var getData = function(creds, docid, fn){
  sheets(creds, docid, function(res){
    Data = validateData(res);
    console.log('Data, retrieved!');
    if(fn) fn();
  });
};

/**
 * Make sure for any given value on column 1 exist data in column 2
 * @param {Object} data
 * @returns {Object}
 */
var validateData = function(data){
  return _.filter(data, function(item){
    var col = item.col === 2 ? 1 : 2;
    return _.find(data, {col: col, row: item.row});
  });
};
