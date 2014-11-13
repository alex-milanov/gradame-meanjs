'use strict';

module.exports = {
  db: 'mongodb://localhost/grada-new-dev',
  app: {
    title: 'Grada.me - Development Environment'
  },
  port: 3021,
  localAuth : {
    ttl: 3600000, //1 hour
    resetTokenExpiresMinutes: 20, //20 minutes later
  },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  }
};