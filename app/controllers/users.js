'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  crypto = require('crypto'),
  _ = require('lodash');


  var flash = function (info, error) {
    return {
      info: info,
      err: error
    };
  }



/**
 * Signup
 */
exports.register = function(req, res) {
  var name = req.body.fullname;
  var email = req.body.email;
  var password = req.body.password;
  var user = new User({full_name: name,email: email});
  var message;

  User.register(user, password, function(error, account) {
    if (error) {
      if (error.name === 'BadRequesterroror' && error.message && error.message.indexOf('exists') > -1) {
        message = flash(null, 'Sorry. That email already exists. Try again.');
      }
      else if (error.name === 'BadRequesterroror' && error.message && error.message.indexOf('argument not set')) {
        message =  flash (null, 'It looks like you\'re missing a required argument. Try again.');
      }
      else {
        message = flash(null, 'Sorry. There was an error processing your request. Please try again or contact technical support.');
      }

      res.json(message);

      //res.render('register', message);
    }
    else {
      //Successfully registered user
      //res.redirect('login?registered=1');
      res.json({registered : true});
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.login = function(req, res, next) {
  if (req.user) {

    var email = req.user.email;

    User.createUserToken(req.user.email, function(err, usersToken) {
      if (err) {
        res.json({error: 'Issue generating token'});
      } else {

        var hash = crypto.createHash('md5').update(email).digest("hex");

        User.findUser(email, usersToken, function(err, user) {
          if (err) {
            res.json({error: 'Issue finding user.'});
          } else {
            if (Token.hasExpired(user.token.date_created)) {
              res.json({error: 'Token expired. You need to log in again.'});
            } else {
              res.json({
                user: {
                  hash: hash,
                  email: user.email,
                  full_name: user.full_name
                },
                token: user.token.token
              });
            }
          }
        });

      }
    });
  } else {
    res.json({error: 'AuthError'});
  }
};

/**
 * Signout
 */
exports.logout = function(req, res) {
  var messages = flash('Logged out', null);
  var incomingToken = req.headers.token;

  if(!incomingToken) {
    res.send(401);
    res.end();
  }

  if (incomingToken) {
    var decoded = User.decode(incomingToken);
    if (decoded && decoded.email) {
      User.invalidateUserToken(decoded.email, function(err, user) {
        if (err) {
          res.json({error: 'Issue finding user (in unsuccessful attempt to invalidate token).'});
        } else {
          res.json({message: 'logged out'});
        }
      });
    } else {
      res.json({error: 'Issue decoding incoming token.'});
    }
  }
};

/**
 * Send User
 */
exports.me = function(req, res) {
  var incomingToken = req.headers.token;
  var decoded = User.decode(incomingToken);

  // Now do a lookup on that email in mongodb ... if exists it's a real user
  if (decoded && decoded.email) {
    User.findUser(decoded.email, incomingToken, function(err, user) {
      if (err) {
        res.json({error: 'Issue finding user.'});
      } else {
        if (Token.hasExpired(user.token.date_created)) {
          res.json({error: 'Token expired. You need to log in again.'});
        } else {
          res.json({
            user: {
              email: user.email,
              full_name: user.full_name
            }
          });
        }
      }
    });
  } else {
    res.json({error: 'Issue decoding incoming token.'});
  }

  //res.jsonp(req.user || null);
};


exports.requiresToken = function(req, res, next) {
    if (!req.headers.token || !req.user){
        return res.status(401).send({
            message: 'User is not logged in or token expired'
        });
    }

    next();
};


exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error('Failed to load User ' + id));
    req.profile = user;
    next();
  });
};

