'use strict';

app.controller('AuthCtrl',
  function ($scope, $location, Auth, Profile) {
    
    $scope.$on('userLoggedIn',function(event, userData){
      $scope.userData = userData;
    })

    if(Profile.getUserData()){
      $scope.userData = Profile.getUserData();
    }

    $scope.login = function () {
      Auth.login($scope.user);
     
    };
 
    $scope.register = function () {
      Auth.register($scope.user);
      
    };
    
    $scope.logout = function(){
      Auth.logout()
    };
   
    $scope.signedIn = function () {
      return Auth.signedIn();
    };
    
  });