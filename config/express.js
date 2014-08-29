'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	config = require('./config'),
	consolidate = require('consolidate'),
	swig = require('swig'),
	path = require('path'),
	utilities = require('./utilities');

var express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	passport = require('passport'),
	flash = require('connect-flash')

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Initialize models
	utilities.walk('./app/models', /(.*)\.(js$|coffee$)/).forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting the environment locals
	app.locals.title = config.app.title
  app.locals.description = config.app.description
  app.locals.keywords = config.app.keywords
//		app.locals.facebookAppId: config.facebook.clientID,
//		app.locals.modulesJSFiles: utilities.walk('./public/modules', /(.*)\.(js)/, /(.*)\.(spec.js)/, './public'),
//		app.locals.modulesCSSFiles: utilities.walk('./public/modules', /(.*)\.(css)/, null, './public')

	// cross domain support
	app.use(function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	
		// intercept OPTIONS method
		if ('OPTIONS' == req.method) {
		  res.send(200);
		}
		else {
		  next();
		}
	});

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + ':// ' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'html');
	app.set('views', config.root + '/app/views');

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Enable jsonp
	app.enable('jsonp callback');

	

	// use passport
	app.use(passport.initialize());
	//app.use(passport.session());

	// connect flash for flash messages
	//app.use(flash());

  // use less middleware
  app.use(less(config.root + '/public'));

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Setting the app router and static folder
	app.use(express.static(config.root + '/public'));

	// Load Routes
	utilities.walk('./app/routes', /(.*)\.(js$|coffee$)/).forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500.html', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404.html', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	return app;
};
