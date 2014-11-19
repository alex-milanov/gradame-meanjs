'use strict';

app.controller('NavCtrl', function ($scope, $location, Auth) {    
  
  // handle menu
  $scope.isCollapsed = false;
	
	$scope.toggleCollapsibleMenu = function() {
		$scope.isCollapsed = !$scope.isCollapsed;
	};

	// Collapsing the menu after navigation
	$scope.$on('$stateChangeSuccess', function() {
		$scope.isCollapsed = false;
	});
});
