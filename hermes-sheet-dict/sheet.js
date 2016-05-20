/**
 * @fileOverview Get access to a given google spreadsheet
 * @name sheet.js
 * @author 5hah.in
 * @license 
 */
var GoogleSpreadSheet = require('google-spreadsheet');
var Promise = require('promise');

var doc, data;

module.exports = function(creds, docid, fn){
  doc = new GoogleSpreadSheet(docid);
  setAuth(creds)
    .then(getInfoAndWorksheets)
    .then(getData)
    .then(fn);
};

/**
 * Set authentication context
 * @param {Object} creds Google generated credentials
 * @returns {Promise} 
 */
var setAuth = function(creds){
  return new Promise(function(fullfill, reject){
    doc.useServiceAccountAuth(creds, function(err, res){
      if (err) reject(err);
      else fullfill(res);
    });
  });
};


/**
 * Get info from a given sheet
 * @returns {Promise} 
 */
var getInfoAndWorksheets = function(){
  return new Promise(function(fullfill, reject){
    doc.getInfo(function(err, res){
      if (err) reject(err);
      else fullfill(res.worksheets[0]);
    });
  });
};

/**
 * Get dictionary data from first 2 column of a given sheet
 * @param {Object} sheet
 * @returns {Promise}
 */
var getData = function(sheet){
  return new Promise(function(fullfill, reject){
    var query = {'max-col': 2};
    sheet.getCells(query, function(err, res){
      if (err) reject(err);
      else fullfill(cleanup(res));
    });
  });
};

/**
 * Create a usable Object from data.
 * @param {Array} data
 * @returns {Array}
 */
var cleanup = function(data){
  return data.map(function(cell){
    return {
      row: cell.row,
      col: cell.col,
      value: cell._value
    };
  });
};

