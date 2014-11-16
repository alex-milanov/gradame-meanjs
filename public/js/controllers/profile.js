"use strict"
app.controller('ProfileCtrl',
	[ "$scope", "$state", "$location", "$http", "Auth", 
	function ($scope, $state, $location, $http, Auth) {
		
		if(!Auth.signedIn()){
			Auth.logout();
		}

		if(Auth.getUserData()){
			$scope.user = _.clone(Auth.getUserData());
		}

		$scope.save = function (userData) {
			$http.put('/users/me',userData).success(function(){
				console.log('User Data Updated');
				Auth.reloadUserData().then(function(){
					$state.go('home.profile');
				})
			})
		};

		$scope.changePic = function(provider){
			 $http.post('/users/me/picture',{provider:provider}).success(function(data){
				if(data.msg){
					console.log(data.msg)
				}
				Auth.reloadUserData().then(function(){
					$state.go('home.profile'); //, {}, { reload: true, inherit: false, notify: true, location: true });
				})
			 })
		}
		
	}]);