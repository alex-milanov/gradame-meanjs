'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Signal = mongoose.model('Signal'),
	_ = require('lodash');

/**
 * Create a signal
 */
exports.create = function(req, res) {
	var signal = new Signal(req.body);
	signal.user = req.user;

	signal.save(function(err) {
		if (err) {
			res.jsonp({
				errors: err.errors,
				signal: signal
			});
		} else {
			res.jsonp(signal);
		}
	});
};

/**
 * Show the current signal
 */
exports.read = function(req, res) {
	res.jsonp(req.signal);
};

/**
 * Update a signal
 */
exports.update = function(req, res) {
	var signal = req.signal;

	signal = _.extend(signal, req.body);

	signal.save(function(err) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(signal);
		}
	});
};

/**
 * Delete an signal
 */
exports.delete = function(req, res) {
	var signal = req.signal;

	signal.remove(function(err) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(signal);
		}
	});
};

/**
 * List of Signals
 */
exports.list = function(req, res) {
	Signal.find().sort('-created').populate('user', 'displayName').exec(function(err, signals) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(signals);
		}
	});
};

/**
 * Signal middleware
 */
exports.signalByID = function(req, res, next, id) {
	Signal.load(id, function(err, signal) {
		if (err) return next(err);
		if (!signal) return next(new Error('Failed to load signal ' + id));
		req.signal = signal;
		next();
	});
};

/**
 * Signal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.signal.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};