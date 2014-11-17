'use strict';

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var passport = require('passport');

module.exports = function(app) {
  // User Routes
  var users = require('../../app/controllers/users');
 

  app.post('/register', users.register);
  app.post('/login', passport.authenticate('local', {session: false}), users.login);
  app.get('/logout', users.logout);

  app.route('/users/me')
    .get(users.me)
    .put(users.update);
  app.route('/users/me/picture')
    .post(multipartMiddleware,users.updatePicture);
  

  /** oauth provider routes **/

  // route for oauth provider (facebook, google, ..) authentication and login
  app.route('/oauth/:provider')
    .get(users.oauthPrepareCall)
    .delete(users.oauthUnlink);

  // handle the callback after oauth provider has authenticated the user
  app.route('/oauth/:provider/callback').get(users.oauthProcessProfile,users.oauthCallback);
  
  app.param('provider',users.oauthProviderParam)

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
