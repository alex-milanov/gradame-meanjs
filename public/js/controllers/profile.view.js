"use strict"
app.controller('ProfileViewCtrl',
	[ "$scope", "$state", "$upload", "$location", "$http", "Auth", "Profile",
	function ($scope, $state, $upload, $location, $http, Auth, Profile) {
		
		// TODO: move to main ctrl
		if(!Auth.signedIn()){
			Auth.logout();
		}

		if(Profile.getUserData()){
			$scope.user = _.clone(Profile.getUserData());
		}

		$scope.linkWith = Auth.linkWith;
		$scope.unlink = Auth.unlink;

		
		
	}]);