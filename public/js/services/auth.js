'use strict';

app.factory('Auth', ['$rootScope', '$state', '$templateCache', '$http', '$location', '$q', 'TokenHandler', 'Profile',
  function ($rootScope, $state, $templateCache, $http, $location, $q, TokenHandler, Profile) {

  var signedIn = false;

  var states = {
    profile : 'home.profile',
    login : 'home.login'
  }

  

  var performLogin = function(token){
    if(token){
      TokenHandler.set(token);
    }
    Profile.loadUserData().then(function(){
      signedIn = true;
      $rootScope.$broadcast('userLoggedIn',Profile.getUserData());
      $templateCache.removeAll();
      $state.go(states.profile,{},{reload: true});
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
    },
    signedIn: function () {
      return signedIn;
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
    performLogin: performLogin,
    linkWith: function(provider){
      window.location.assign('/oauth/facebook?state='+TokenHandler.get());
    },
    unlink: function(provider){
      $http.delete("/oauth/"+provider)
        .success(function(data) {
          console.log(data);
          performLogin(TokenHandler.get());
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }
  };

  return Auth;
}]);
