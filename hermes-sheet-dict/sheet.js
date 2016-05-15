var GoogleSpreadSheet = require('google-spreadsheet');
var Promise = require('promise');

var doc, data;

module.exports = function(docid, fn){
  doc = new GoogleSpreadSheet(docid);
  setAuth()
    .then(getInfoAndWorksheets)
    .then(getData)
    .then(fn);
};

var setAuth = function(){
  var creds = require('./google-generated-creds.json');

  return new Promise(function(fullfill, reject){
    doc.useServiceAccountAuth(creds, function(err, res){
      if (err) reject(err);
      else fullfill(res);
    });
  });
};

var getInfoAndWorksheets = function(){
  return new Promise(function(fullfill, reject){
    doc.getInfo(function(err, res){
      if (err) reject(err);
      else fullfill(res.worksheets[0]);
    });
  });
};

var getData = function(sheet){
  return new Promise(function(fullfill, reject){
    var query = {'max-col': 2};
    sheet.getCells(query, function(err, res){
      if (err) reject(err);
      else fullfill(cleanup(res));
    });
  });
};

var cleanup = function(data){
  return data.map(function(cell){
    return {
      row: cell.row,
      col: cell.col,
      value: cell._value
    };
  });
};

