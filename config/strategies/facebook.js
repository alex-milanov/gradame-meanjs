"use strict"

/**
 * Module dependencies.
 */
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('../auth');

module.exports = function() {

	passport.use(new FacebookStrategy({
		clientID		: configAuth.facebook.clientID,
		clientSecret	: configAuth.facebook.clientSecret,
		callbackURL		: configAuth.facebook.callbackURL,
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done) {

		// Create the user OAuth profile
		var providerUserProfile = {}
		providerUserProfile.id	= profile.id;
		providerUserProfile.token = accessToken;
		providerUserProfile.name  = profile.name.givenName + ' ' + profile.name.familyName;
		providerUserProfile.email = profile.emails[0].value;
		providerUserProfile.username = profile.username;
		/*
		{
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			email: profile.emails[0].value,
			username: profile.username,
			provider: 'facebook',
			providerIdentifierField: 'id',
			providerData: providerData
		};
		*/

		return done(null, providerUserProfile);
			
	}));
};