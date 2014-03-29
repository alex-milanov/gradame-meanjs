'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var signals = require('../../app/controllers/signals');

	// Article Routes
	app.get('/api/signals', signals.list);
	//app.post('/signals', users.requiresLogin, signals.create);
	app.post('/api/signals', signals.create);
	app.get('/api/signals/:signalId', signals.read);
	//app.put('/signals/:signalId', users.requiresLogin, signals.hasAuthorization, signals.update);
	app.put('/api/signals/:signalId', signals.update);
	//app.del('/signals/:signalId', users.requiresLogin, signals.hasAuthorization, signals.delete);
	app.del('/api/signals/:signalId', signals.delete);

	// Finish by binding the article middleware
	app.param('signalId', signals.signalByID);
};