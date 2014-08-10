'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	utilities = require('./utilities');

module.exports = function() {
	

	// Initialize strategies
	utilities.walk('./config/strategies', /(.*)\.(js$|coffee$)/).forEach(function(strategyPath) {
		require(path.resolve(strategyPath))();
	});
};