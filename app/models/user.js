'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
    path = require('path'),
    config = require(path.join(__dirname, '../..', '/config/auth.js')).localAuth,
    passportLocalMongoose = require('passport-local-mongoose'),
    crypto = require('crypto'),
    jwt = require('jwt-simple'),
    tokenSecret = 'put-a-$Ecr3t-h3re';


console.log({config: config});

// token schema
var TokenSchema = new mongoose.Schema({
    token: {type: String},
    date_created: {type: Date, default: Date.now},
});

TokenSchema.statics.hasExpired= function(created) {
    var now = new Date();
    var diff = (now.getTime() - created);
    return diff > config.ttl;
};


// todo add the stuff to
var TokenModel = mongoose.model('Token', TokenSchema);


/**
 * A Validation function for local strategy properties
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};
var validateLocalStrategyPassword = function(password) {
  return (this.provider !== 'local' || (password && password.length > 6));
};
 */




/**
 * User Schema
 */
var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    validated: String,

    date_created: { type: Date, default: Date.now },
    date_updated: { type: Date },
    
    picture: {
        url: String,
        provider: String // upload, facebook ...
    },
    role: { type: String, default: 'user' },    // user | admin 

    token: {type: Object},
    //For reset we use a reset token with an expiry (which must be checked)
    reset_token: {type: String},
    reset_token_expires_millis: {type: Number},

    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        username     : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        picture      : String
    }
});


// add plugin for auth purposes
UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

UserSchema.statics.encode = function(data) {
    return jwt.encode(data, tokenSecret);
};
UserSchema.statics.decode = function(data) {
    return jwt.decode(data, tokenSecret);
};

// methods ======================
UserSchema.statics.findUser = function(email, token, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
        } else if (usr.token && usr.token.token && token === usr.token.token) {
            cb(false, {id: usr._id, email: usr.email, token: usr.token, date_created: usr.date_created, name: usr.name});
        } else {
            cb(new Error('Token does not exist or does not match.'), null);
        }
    });
};

UserSchema.statics.findUserByEmailOnly = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
        } else {
            cb(false, usr);
        }
    });
};
UserSchema.statics.createUserToken = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            console.log('err');
        }
        //Create a token and add to user and save
        var token = self.encode({email: email});
        usr.token = new TokenModel({token:token});
        usr.save(function(err, usr) {
            if (err) {
                cb(err, null);
            } else {
                console.log("about to cb with usr.token.token: " + usr.token.token);
                cb(false, usr.token.token);//token object, in turn, has a token property :)
            }
        });
    });
};

UserSchema.statics.invalidateUserToken = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            console.log('err');
        }
        usr.token = null;
        usr.save(function(err, usr) {
            if (err) {
                cb(err, null);
            } else {
                cb(false, 'removed');
            }
        });
    });
};
UserSchema.statics.generateResetToken = function(email, cb) {
    console.log("in generateResetToken....");
    this.findUserByEmailOnly(email, function(err, user) {
        if (err) {
            cb(err, null);
        } else if (user) {
            //Generate reset token and URL link; also, create expiry for reset token
            user.reset_token = require('crypto').randomBytes(32).toString('hex');
            var now = new Date();
            var expires = new Date(now.getTime() + (config.resetTokenExpiresMinutes * 60 * 1000)).getTime();
            user.reset_token_expires_millis = expires;
            user.save();
            cb(false, user);
        } else {
            //TODO: This is not really robust and we should probably return an error code or something here
            cb(new Error('No user with that email found.'), null);
        }
    });
};

module.exports = mongoose.model('User', UserSchema);