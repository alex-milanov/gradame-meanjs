'use strict'

var app = angular.module('gradame', [
  'ui.router',
  'ImageCropper',
  'angularFileUpload',
  'ur.file',
  'google-maps',
  'ngResource',
  'ngStorage'
  ]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

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

    $urlRouterProvider.otherwise('/');



    $stateProvider
      .state('home', {
        url : '/',
        views: {
          "@": {
            controller: 'SignalsCtrl',
            templateUrl: '/views/states/home.html',  
          },
          'sidebar@home' : {
            templateUrl: '/views/states/signals/sidebar.html',
          },
          'map-container@home' : {
            templateUrl: '/views/states/signals/map-container.html',
          },
          'page-container@home' : {
            templateUrl: '/views/states/home-page-container.html'
          }
        }
      })
      .state('home.login', {
        url : 'login',
        views: {
          'page-container@home' : {
            templateUrl: '/views/states/login.html',
            controller: 'AuthCtrl'
          }
        }
      })
      .state('home.register', {
        url : 'register',
        views: {
          'page-container@home' : {
            templateUrl: '/views/states/register.html',
            controller: 'AuthCtrl'
          }
        }
      })
      /* signals ctrls */
      .state('home.signals', {
        url : 'signals',
        views: {
          'sidebar@home' : {
            templateUrl: '/views/states/signals/sidebar.html'
          },
          'page-container@home' : {
            template: ''
          }
        }
      })
      .state('home.signals.new', {
        url : '/new',
        views: {
          'sidebar@home' : {
            templateUrl: '/views/states/signals/new.html',
            controller: 'SignalsNewCtrl'
          },
          'page-container@home' : {
            template: ''
          }
        }
      })
      .state('home.signals.view', {
        url : '/{signalId}',
        views: {
          'page-container@home' : {
            templateUrl: '/views/states/signals/view.html',
            controller: 'SignalsViewCtrl'
          }
        }
      })
      /* profile ctrls */
      .state('home.profile', {
        url : 'profile',
        views: {
          'sidebar@home' : {
            templateUrl: '/views/states/profile/view.html',
            controller: 'ProfileViewCtrl'
          },
          'page-container@home' : {
            templateUrl: '/views/states/profile/activities.html'
          }
        }
      })
      .state('home.profile.edit', {
        url : '/edit',
        views: {
          'page-container@home' : {
            templateUrl: '/views/states/profile/edit.html',
            controller: 'ProfileEditCtrl'
          }
        }
      })
      .state('home.profile.changePicture', {
        url : '/change-picture',
        views: {
          'page-container@home' : {
            templateUrl: '/views/states/profile/change-picture.html',
            controller: 'ProfileEditCtrl'
          }
        }
      })
      

    $locationProvider.hashPrefix('!');



    //$locationProvider.html5Mode(true);
  }
]);

angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') window.location.hash = '#!';

  //Then init the app
  angular.bootstrap(document, ['gradame']);
});

