'use strict'

app.factory('Profile', ['$rootScope', '$state', '$templateCache', '$http', '$location', '$q', 'TokenHandler', 'User',
	function ($rootScope, $state, $templateCache, $http, $location, $q, TokenHandler, User) {
		
		var userData = false;

		var loadUserData = function(){
			return User.me().$promise.then(function(data){
				userData = data;
			});
		}

		// TODO: move here change pic, edit, link, unlink

		var Profile = {
			getUserData: function() {
				return userData;
			},
			loadUserData: loadUserData
		}

		
		return Profile;

	}]);
