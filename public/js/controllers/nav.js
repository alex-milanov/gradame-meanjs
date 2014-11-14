'use strict';

app.controller('NavCtrl', function ($scope, $location, Auth) {    
    // handle auth
    $scope.user = {};

    $scope.signedIn = function(){
      if (Auth.signedIn()) {
        $scope.user = Auth.me();
        return true;
      }
      return false;
    }

    $scope.logout = Auth.logout;

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
