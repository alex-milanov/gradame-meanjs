'use strict';

var fs = require("fs"),
  path = require("path"),
  config = require('../../config/config');

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
  res.render('index.jade', {
    user: req.user || null
  });
};


exports.views = function(req, res){
  var filePath = req.params[0];
  var jadePath = filePath.replace('html','jade');
  console.log(config.root + '/app/views/default/' + jadePath);
  fs.exists(config.root + '/app/views/default/' + jadePath, function (exists) {
    console.log(exists);
    if(exists){
      res.render('default/'+jadePath);
    } else {
    console.log(config.root + '/public/views/' + filePath);
    // fallback to the current public views directory
    fs.exists(config.root + '/public/views/' + filePath, function (exists) {
      if(exists){
        res.render('../../public/views/'+filePath);
      }
      });
    }
  });
}