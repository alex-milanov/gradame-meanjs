'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  passport = require('passport'),
  crypto = require('crypto'),
  path = require('path'),
  moment = require('moment'),
  fs = require('fs'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  _ = require('lodash');
var imageUtilsService = require('../services/imageUtils')();


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
  var user = new User({name: name,email: email});
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
  } else if(user.facebook && user.facebook.id && user.facebook.token){
    picture = {
      url: 'https://graph.facebook.com/' + user.facebook.id 
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

exports.getPicture = function(req, res){
  var user = req.user;
  res.jsonp(getPicture(user));
}


// TODO: move image and file functionality to service


// TODO: delete old uploaded picture after change
exports.updatePicture = function(req, res){
  var user = req.user;
  var picture = req.body;
  

  if(picture.provider == "upload"){

    var imageBuffer = imageUtilsService.decodeBase64Image(picture.fileString);
    if (!imageBuffer) {
      res.jsonp({msg:'Could not read new profile image from request because of incorrect base64 encoded image'});
    } else {
      
      var destFileName = user._id + '_' + moment() + imageBuffer.typeExtension;
      var destImgUrl = 'img/users/' + destFileName;
      var destImgPath = path.join(__dirname, '../..','public', destImgUrl);
      
      console.log(destImgPath);

      fs.writeFile(destImgPath, imageBuffer.data, function (err, data) {
        if (err) {
          res.jsonp({msg:err});
        } else {
          user.picture = {
            'url': destImgUrl,
            'provider': 'upload'
          };

          user.save(function(err, result){
            if(!err)
              res.jsonp({msg:'Successfully changed picture'})
          })

        }
      });
    }
  } else {

    var picChanged = false;
    var msg = '';

    switch(picture.provider){
      case 'facebook':
        if(user.facebook && user.facebook.id && user.facebook.token){
          user.picture = {
            url: 'https://graph.facebook.com/' + user.facebook.id 
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

}



/**
* OAuth middleware
*/

exports.oauthPrepareCall = function(req, res, next) {
  var provider = req.provider;

  var params = {};
  // scope
  switch(provider){
    case 'facebook':
      params.scope = 'email'
      break;
    case 'google':
      params.scope = ['profile', 'email'];
      break;
  }
  // state
  if(req.user && req.user.token && req.user.token.token){
    // pass the user token as state
    params.state = req.user.token.token;
  }

  passport.authenticate(provider, params)(req, res, next);
}

exports.oauthProcessProfile = function(req, res, next) {
  var provider = req.provider;
  passport.authenticate(provider, function(err, providerData) {
    console.log(err,providerData);
    
    if (!req.user) {

      var providerIdField = 'id';
      var providerIdFieldPath = provider +'.'+providerIdField;
      var queryMatch = {};
      queryMatch[providerIdFieldPath] = providerData.id;

      console.log(queryMatch);

      User.findOne(queryMatch, function(err, user) {

        // if the user is found, then log them in
        if (user) {
          
          if (!user[provider].token) {
            user[provider] = providerData;

            user.save(function(err) {
              req.user = user;
              next();
            });
          } else {
            req.user = user;
            next();
          }
        } else {
          // if there is no user found with that facebook id, create them
          var newUser     = new User();
          newUser[provider] = providerData;
          
          // automatically import user data
          newUser.email = providerData.email
          newUser.name = providerData.name;

          // save our user to the database
          newUser.save(function(err) {
            req.user = newUser;
            next();
          });
          
        }

      });

    } else {
      // user already exists and is logged in, we have to link accounts
      var user = req.user; // pull the user out of the session

      // update the current users facebook credentials
      user[provider] = providerData;

      // save the user
      user.save(function(err) {
        req.user = user;
        next();
      });
    }
  })(req, res, next);
}

exports.oauthCallback = function(req, res, next) {
  var user = req.user;
  req.login(user, function(err) {
    if (err) {
      return res.redirect('/#!/login');
    }
    var redirectURL = '/#!/';
    User.createUserToken(req.user.email, function(err, usersToken) {
      if (err) {
        res.redirect('/#!/login');
      } else {
        res.redirect(redirectURL+'?'+usersToken);
      }
    });
    return;
  });
};

exports.oauthUnlink = function(req, res) {
  if(req.user && req.provider && req.user[req.provider]){
    var user = req.user;
    var provider = req.provider;
    
    user.set(provider,undefined);

    user.save(function(err) {
      if (err) {
        res.status('500').jsonp({
          msg: 'could not unlink',
          err: err
        });
      } else {
        res.jsonp({
          'unlinked' : true
        })
      }
    });
  } else {
    res.status('404').jsonp({
      msg: 'not linked'
    });
  }
}

exports.oauthProviderParam = function(req,res,next,provider){
  req.provider = provider;
  next();
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

