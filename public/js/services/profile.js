'use strict'

app.factory('Auth', ['$rootScope', '$state', '$templateCache', '$http', '$location', '$q', 'TokenHandler', 'User',
	function ($rootScope, $state, $templateCache, $http, $location, $q, TokenHandler, User) {
		
		var userData = false;

		var loadUserData = function(){
			return User.me().$promise.then(function(data){
				userData = data;
			});
		}

		

	}]);
