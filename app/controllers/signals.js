'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Signal = mongoose.model('Signal'),
	fs = require('fs'),
	Q = require('q'),
	path = require('path'),
	_ = require('lodash'),
	utilities = require('../../config/utilities.js');


/**
 * Create a signal
 */
// TODO: Implement Promises
exports.create = function(req, res) {

	var location = req.body.location;

	if(location && location.length){
		location = location.substr(1,location.length-2);
		req.body.location = location.split(', ');
	}

	var signal = new Signal(req.body);

	if(req.user && req.user.id){
		signal.author = req.user.id;
	}

	console.log(req.body);
	
	signal.save(function(err) {
		if (err) {
			res.jsonp({
				errors: err.errors,
				signal: signal
			});
		} else {

			// populate files 
			if(req.files){

				var signalPath = path.join(__dirname , "/../../public/img/signals/", signal['_id']+'');
				var images = [];
				if(!fs.existsSync(path.join(__dirname , "/../../public/img/signals"))){
					fs.mkdirSync(path.join(__dirname , "/../../public/img/signals"));
				}

				if(!fs.existsSync(signalPath) || !fs.statSync(signalPath).isDirectory()){
					fs.mkdirSync(signalPath);
				}

				var index = 0;
				for(var i in req.files){
					var file = req.files[i];
					var ext = file.name.substr(file.name.lastIndexOf('.'));
					var newPath = signalPath+'/'+index+ext;
					images.push(''+index+ext);
					var fileData = fs.readFileSync(file.path);
					fs.writeFileSync(newPath, fileData);
					index++;
				}

				signal.images = images;

				signal.save(function(){
					if (err) {
						res.jsonp({
							errors: err.errors,
							signal: signal
						});
					} else {
						res.jsonp(signal);
					}
				});
			} else {
				res.jsonp(signal);
			}
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

	console.log({user: req.user});

	var queryJson = {};

	if(req.query){
		if(req.query.bounds){
			var bounds = req.query.bounds;
			
			bounds = bounds.substr(1,bounds.length-2).split('), (');
			console.log(bounds);

			bounds[0] = bounds[0].substr(1,bounds[0].length-1).split(', ');
			bounds[1] = bounds[1].substr(0,bounds[1].length-2).split(', ');

			
			queryJson['location'] = { $geoWithin : { $box : bounds} };
			//console.log(bounds);

		}
		if(req.query.type){
			queryJson['type'] = req.query.type;
		}
		if(req.query.status){
			queryJson['status'] = req.query.status;
		}

	}


	Signal.find(queryJson).sort('-created').populate('user', 'displayName').exec(function(err, signals) {
		if (err) {
			res.jsonp('error', {
				status: 500,
				err: err
			});
		} else {

			res.jsonp(signals);
			
		}
	});
};




exports.findNear = function(req, res) {

	var location = req.query.location;

	if(location && location.length){
		location = location.substr(1,location.length-2);
		req.query.location = location.split(', ');
	}

	if(!location.length){
		console.log({err: 'Location is malformed',location: location});
		res.jsonp('error', {
			status: 500
		});
	} else {
		// $maxDistance: 0.00019
		Signal.find({location: { $nearSphere: req.query.location, $maxDistance: 0.00025} }, function(err, signals) {
			if (err) {
				res.jsonp('error', {
					status: 500
				});
			} else {

				res.jsonp(signals);
				
			}
		});
	}

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