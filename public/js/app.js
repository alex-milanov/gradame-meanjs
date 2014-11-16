'use strict'

var app = angular.module('gradame', [
  'ui.router',
  //'ui.router.compat',
  'ur.file',
  'google-maps',
  'ngResource',
  'ngStorage'
  ]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(['TokenHandler', function(TokenHandler) {
      return {
        request: function(config) {
          // add token unless we are requesting an external site
          if (!config.url.match(/^http/)) {
            config.headers['token'] = TokenHandler.get();
          }

          return config;
        }
      }
    }]);

    $stateProvider
      .state('home', {
        url : '',
        templateUrl: '/views/states/home.html'
      })
      .state('home-dash', {
        url : '/',
        templateUrl: '/views/states/home.html'
      })
      .state('login', {
        url : '/login',
        templateUrl: '/views/states/login.html',
        controller: 'AuthCtrl'
      })
      .state('register', {
        url : '/register',
        templateUrl: '/views/states/register.html',
        controller: 'AuthCtrl'
      })
      .state('profile', {
        url : '/profile',
        templateUrl: '/views/states/profile/index.html',
        controller: 'ProfileCtrl'
      })
      .state('profile.edit', {
        url : '/profile/edit',
        templateUrl: '/views/states/profile/edit.html'
      })
      .state('signals', {
        url : '/signals',
        templateUrl: '/views/states/signals/index.html',
        controller: 'SignalsCtrl'
      })
      .state('signals-new', {
        url : '/signals/new',
        templateUrl: '/views/states/signals/new.html',
        controller: 'SignalsNewCtrl'
      })
      .state('signals-view', {
        url : '/signals/{signalId}',
        templateUrl: '/views/states/signals/view.html',
        controller: 'SignalsViewCtrl'
      })
      .state("otherwise", { url : '/'});

    //$locationProvider.html5Mode(true);
  }
]);

