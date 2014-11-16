'use strict';

app.factory('Auth', ['$rootScope', '$state', '$templateCache', '$http', '$location', '$q', 'TokenHandler', 'User',
  function ($rootScope, $state, $templateCache, $http, $location, $q, TokenHandler, User) {

  var signedIn = false;
  var userData = false;

  var states = {
    profile : 'profile',
    login : 'login'
  }

  var loadUserData = function(){
    return User.me().$promise.then(function(data){
      userData = data;
    });
  }

  var performLogin = function(token){
    TokenHandler.set(token);
      loadUserData().then(function(){
        signedIn = true;
        $rootScope.$broadcast('userLoggedIn',userData);
        $templateCache.removeAll();
        $state.go(states.profile);
      }, function(err) {
        console.log(err);
        Auth.logout();
      })
  };

  if(location.hash && location.hash.substr(3,1) == '?'){
    var token = location.hash.substr(4);
    location.hash  = '#!/';
    performLogin(token);     
  }

  var Auth = {
    register: function (user) {       
      $http.post("/register", user)
    .success(function(data) {
      if(data.token){
        performLogin(data.token);
      } else {
        Auth.logout();
      }
      
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
      //return auth.$createUser(user.email, user.password);
    },
    signedIn: function () {
      return signedIn;
      //return auth.user !== null;
    },
    getUserData: function() {
      return userData;
    },
    login: function (user) {
      $http.post("/login", user)
    .success(function(data) {
      if(data.token){
        performLogin(data.token);
      }
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
      //return auth.$login('password', user);
    },
    logout: function () {
      console.log('logging out')
      TokenHandler.set("");
      signedIn = false;
      $templateCache.removeAll();
      $state.go(states.login);
      //auth.$logout();
    },
    reloadUserData: function() {
      performLogin(TokenHandler.get());
    }
  };

  return Auth;
}]);
