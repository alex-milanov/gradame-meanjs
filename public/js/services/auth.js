'use strict';

app.factory('Auth', ['$rootScope', '$http', '$location', '$q', 'TokenHandler',
  function ($rootScope, $http, $location, $q, TokenHandler) {

  var signedIn = false;
  var fbConnected = false;
  var userData = {};

  $http.get('/api/users/me').success(function(data) {
    userData = data.user;
  })

  $rootScope.signedIn = function () {
    return Auth.signedIn();
  };

  var Auth = {
    me: function() {
      return userData;
    },
    register: function(user) {
      $http.post("/auth/register", user)
        .success(function(data) {
          $location.url('/');
        }).error(function(data) {
          console.log('Error: ' + data);
        });
    },
    fbConnect: function() {

    },
    fbConnected: function() {
      return fbConnected;
    },
    signedIn: function () {
      var token = TokenHandler.get();

      return _.isString(token) && !_.isEmpty(token);
      //return auth.user !== null;
    },
    login: function (user) {
      return $http.post("/auth/login", user)
        .success(function(data) {
          if(data.token){
            TokenHandler.set(data.token);
            signedIn = true;
            userData = data.user;

            return data;
          } else {
            return $q.reject(data);
          }
        }).error(function(data) {
          return $q.reject(data);
        });
      //return auth.$login('password', user);
    },
    logout: function () {
      TokenHandler.clear();
      signedIn = false;
      userData = {};
      $location.url('/');
      //auth.$logout();
    }
  };

  return Auth;
}]);
