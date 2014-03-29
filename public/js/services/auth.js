'use strict';
  
app.factory('Auth',
  function ($rootScope, $http, $location, $q, TokenHandler) {
  
	
 	var signedIn = false;
 	var fbConnected = false;
  var userData = {};
 	
    var Auth = {
      me : function(){
        return userData;
      },
      register: function (user) {
      	
      	$http.post("/register", user)
			.success(function(data) {
				//console.log('Success: '+data);
				$location.url('/');
				
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
        //return auth.$createUser(user.email, user.password);
      },
      fbConnect : function(){
      	
      },
      fbConnected : function(){
      	return fbConnected;
      },
      signedIn: function () {
      	return signedIn;
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
    			}).error(
    			function(data) {
            return $q.reject(data);
    			});
        //return auth.$login('password', user);
      },
      logout: function () {
      	TokenHandler.set("");
    		signedIn = false;
        userData = {};
    		$location.url('/');
        //auth.$logout();
      }
    };
 
    $rootScope.signedIn = function () {
      return Auth.signedIn();
    };
 
    return Auth;
  });