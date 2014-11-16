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
exports.login = function(req, res){
  if (req.user) {
    User.createUserToken(req.user.email, function(err, usersToken) {
      // console.log('token generated: ' +usersToken);
      // console.log(err);
      if (err) {
        res.json({error: 'Issue generating token'});
      } else {
        res.json({token : usersToken});
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

var getPicture = function(user){
  var picture = {};

  if(user.picture && user.picture.url && user.picture.url!=''){
    picture = user.picture;
  } else if(user.facebook && user.facebook.username && user.facebook.token){
    picture = {
      url: 'https://graph.facebook.com/' + user.facebook.username 
      + '/picture' + "?width=200&height=200" + "&access_token=" + user.facebook.token,
      provider: 'facebook'
    }
  } else if (user.google && user.google.picture) {
    picture = {
      url: user.google.picture,
      provider: 'google'
    };
  } else {
    var hash = crypto.createHash('md5').update(user.email).digest("hex");
    picture = {
      url: 'http://www.gravatar.com/avatar/'+hash,
      provider: 'gravatar'
    };
  }
  return picture;
}

exports.me = function(req, res) {
  
  var user = req.user;

  var returnObj = {
    email: user.email, 
    token: user.token, 
    date_created: user.date_created, 
    name: user.name
  };

  var providers = ['facebook','google','twitter'];
  returnObj.providers = {};
  for(var i in providers){
    if(user[providers[i]] && user[providers[i]].name){
      returnObj.providers[providers[i]] = user[providers[i]].name;
    }
  }

  // set up picture
  returnObj.picture = getPicture(user);
  

  res.jsonp(returnObj);

};

exports.update = function(req, res){
  var user = req.user;

  if(req.body.name)
    user.name = req.body.name;
  if(req.body.email)
    user.email = req.body.email;

  user.save(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp({
        'updated' : true
      })//ctrl.list(req, res);
    }

  });
};

exports.updatePicture = function(req, res){
    var user = req.user;
    var picture = req.body;

    var picChanged = false;
    var msg = '';

    switch(picture.provider){
      case 'facebook':
        if(user.facebook && user.facebook.username && user.facebook.token){
          user.picture = {
            url: 'https://graph.facebook.com/' + user.facebook.username 
            + '/picture' + "?width=200&height=200" + "&access_token=" + user.facebook.token,
            provider: 'facebook'
          }
          picChanged = true;
        }
        break; 
      case 'google':   
        if (user.google && user.google.picture) {
          user.picture = {
            url: user.google.picture,
            provider: 'google'
          }
          picChanged = true;
        }
        break;
      case 'gravatar':
        var hash = crypto.createHash('md5').update(user.email).digest("hex");
        user.picture = { 
          url: 'http://www.gravatar.com/avatar/'+hash,
          provider: 'gravatar'
        }

        picChanged = true;
        break;
    }
    
    if(picChanged){
      user.save(function(err, result){
        if(!err)
          res.jsonp({msg:'Successfully changed picture'})
      })
    } else {
      res.jsonp({msg: 'Failed to change picture'})
    }

  }

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

