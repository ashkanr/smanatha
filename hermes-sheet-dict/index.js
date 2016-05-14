var sheets = require('./sheet');
var _ = require('lodash');

var Data = null;
module.exports = function(el){
  getData();

  return function(robot){
    robot.help('hello', 'Greetings!');
    robot.help('get <abbreviation>', 'Translate an abbreviation');
    robot.help('update', 'Update abbreviation data');

    robot.on('mention', /hello/i, function(res){
      robot.say('Hi, nice to meet you', res.context);
    });

    robot.on('mention', /update/i, function(res){
      getData(function(){
        robot.say("I've updated my data!", res.context);
      });
    });

    robot.on('mention', /get (.{2})/i, function(res){
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

var format = function(list){
  message = '';
  _.forEach(list, function(item){
    message += "✓ *" + item.word + ":* " + item.translation + ".\n";
  });

  return message;
};

var search = function(term){
  term = _.escapeRegExp(_.unescape(term));

  var matches = _.filter(Data, function(item){
    var regex = new RegExp(term, 'ig');
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

var getData = function(fn){
  sheets(function(res){
    Data = res;
    console.log('Data, retrieved!');
    if(fn) fn();
  });
};
