'use strict';

app.controller('NavCtrl', function ($scope, $location, Auth) {

    $scope.user = {};

    $scope.signedIn = function(){
      if (Auth.signedIn()) {
        $scope.user = Auth.me();
        return true;
      }
      return false;
    }

    $scope.logout = Auth.logout;
});
