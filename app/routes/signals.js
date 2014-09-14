'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var signals = require('../../app/controllers/signals');
  var multipart = require('connect-multiparty');
  var multipartMiddleware = multipart();

  // Article Routes
  app.get('/api/signals', signals.list);
  app.get('/api/signals/near', signals.findNear);
  //app.post('/signals', users.requiresLogin, signals.create);
  app.post('/api/signals', users.requiresToken, multipartMiddleware, signals.create);
  app.get('/api/signals/:signalId', signals.read);
  //app.put('/signals/:signalId', users.requiresLogin, signals.hasAuthorization, signals.update);
  app.put('/api/signals/:signalId', signals.update);
  //app.del('/signals/:signalId', users.requiresLogin, signals.hasAuthorization, signals.delete);
  app.delete('/api/signals/:signalId', signals.delete);


  // Finish by binding the article middleware
  app.param('signalId', signals.signalByID);
};
