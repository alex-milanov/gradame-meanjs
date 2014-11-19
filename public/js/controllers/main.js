'use strict'


app.controller('MainCtrl', function ($scope, $state) {

	$scope.$state = $state;

	$scope.sidebarChoice = 0;

	$scope.sidebarSelect = function(choice){
		$scope.sidebarChoice = choice;
	}

});