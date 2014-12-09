'use strict'

app.controller('SignalsNewCtrl', function ($scope, $location, $http, $timeout, Signal, Maps, Auth) {

  if(!Auth.signedIn()){
    Auth.logout();
  }

  $scope.signal = new Signal();

  $scope.signalTypes = [
    "Улична дупка",
    "Липсваща шахта",
    "Висящи кабели",
    "Нерегламентиран боклук",
    "Вандализъм"
  ];

  $scope.signalStatuses = [
    "отворен",
    "решен"
  ];

  
  $scope.$on('mapPositionChanged',function(event, position){

    
  })

  $scope.$on('mapBoundsChanged',function(event, bounds){
    var position = Maps.getCenter();
    $scope.signal.location = position.toString();
    Maps.geocode(position, function(results){
      $scope.signal.address = results[0].formatted_address;
    });
  });

  $scope.save = function(){
    if(!$scope.signal.status){
      $scope.signal.status = 0;
    }

    if($scope.signal._id){
      Signal.update({_id:$scope.signal._id}, $scope.signal).$promise.then(function(){$location.path('signals');})
      //$scope.signal.$save().then($scope.load);
    } else {
      var signal = $scope.signal;
      Signal.save(signal).$promise.then(function(){
        $location.path('signals');
      });
    }
    //$scope.signal = new Signal();
  }

  $scope.init = function() {
    $timeout(function() {
      Maps.bindAutocomplete('autocomplete');
    });
  }

  $scope.init();

  $scope.reset = function(){
    $scope.signal = new Signal();
  }
});
