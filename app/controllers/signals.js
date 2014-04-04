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
	Signal.find().sort('-created').populate('user', 'displayName').exec(function(err, signals) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {

			res.jsonp(signals);
			/*
			var signalPath = path.join(__dirname , "/../../public/img/signals/")
				
			var the_promises = [];

			for(var i in signals){
			
				
				var deferred = Q.defer();
				var sigPath = path.join(signalPath,signals[i]._id+'');
				var signal = signals[i];
						
				if(fs.existsSync(sigPath)){
						
					var imgPromise = qListTree(sigPath, 1, true).then(function(images){
						var sig = signal.toObject()
						sig.images = images;
						
						//signals[i]["images"] = images;
						return sig;
						
					},function(err){
						console.log({err:err});
					});

        			the_promises.push(imgPromise);
				} else {
					deferred.resolve(signal);
					
        			the_promises.push(deferred.promise);

				}
			
			}

			Q.all(the_promises).then(function(newSignals){
				
			})
			*/

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