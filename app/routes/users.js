'use strict';

var passport = require('passport');

module.exports = function(app) {
  // User Routes
  var users = require('../../app/controllers/users');
  
  app.route('/users/me')
    .get(users.me)
    .put(users.update);
 
  app.route('/users/me/picture')
    .post(users.updatePicture);
 

  app.post('/register', users.register);
  app.post('/login', passport.authenticate('local', {session: false}), users.login);
  app.get('/logout', users.logout);

  /*

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
  }));
  app.get('/auth/facebook/callback', users.oauthCallback('facebook'));

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',  users.oauthCallback('twitter'));

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.get('/auth/google/callback', users.oauthCallback('google'));


  */

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
