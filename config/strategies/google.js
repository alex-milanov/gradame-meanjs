"use strict"

/**
 * Module dependencies.
 */
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('../auth');

module.exports = function() {
	
	passport.use(new GoogleStrategy({

        clientID        : configAuth.google.clientID,
        clientSecret    : configAuth.google.clientSecret,
        callbackURL     : configAuth.google.callbackURL,
        passReqToCallback : true // allows us to pass in the req 

    }, function(req, accessToken, refreshToken, profile, done) {
		
		// Create the user OAuth profile
		var providerUserProfile = {}
		providerUserProfile.id    = profile.id;
		providerUserProfile.token = accessToken;
		providerUserProfile.name  = profile.displayName;
		providerUserProfile.email = profile.emails[0].value; // pull the first email
		providerUserProfile.picture = profile._json.picture;
		 

		return done(null, providerUserProfile);
	}));

};