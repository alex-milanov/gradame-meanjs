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


function qListTree(_path, _levels, _toArray){
    if(!_levels)
            _levels = 1;
    if(!_toArray)
            _toArray = false;
    
    var tree;

    tree = (_toArray) ? [] : {};

    return Q.nfcall(fs.readdir,_path)
            .then(function(files){
                    var the_promises = [];

                files.forEach(function(file) {

                    var filePromise = Q.nfcall(fs.stat,path.join(_path,file))
                            .then(function(stats){
                                    if(stats.isDirectory() && _levels > 1){
                                        return qListTree(path.join(_path,file), _levels-1).then(function(subTree){
                                            if(_toArray){
                                            	tree.push({
                                            		name : file,
                                            		list : subTree
                                            	});
                                            } else {
                                            	tree[file] = subTree;
                                            }
                                        })
                                    } else {
                                    	if(_toArray){
                                    		tree.push(file);
                                        } else {
                                    		tree[file] = file;
                                    	}
                                    }
                            });
                    
                    the_promises.push(filePromise);
                });

                return Q.all(the_promises);
            }).then(function(){
                    return tree;
            });
}

/**
 * Create a signal
 */
// TODO: Implement Promises
exports.create = function(req, res) {
	var signal = new Signal(req.body);
	
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
				if(!fs.existsSync(signalPath) || !fs.statSync(signalPath).isDirectory()){
					fs.mkdirSync(signalPath);
				}

				var index = 0;
				for(var i in req.files){
					var file = req.files[i];
					var ext = file.name.substr(file.name.lastIndexOf('.'));
					var newPath = signalPath+'/'+index+ext;
					var fileData = fs.readFileSync(file.path);
					fs.writeFileSync(newPath, fileData);
					index++;
				}
			}


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
				res.jsonp(newSignals);
			})

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