'use strict';


app.controller('SignalsNewCtrl', function ($scope, $location, $http, $timeout, Signal, Maps) {

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

  Maps.addListener('positionChanged', function(){
    $scope.signal.location = Maps.getPosition().toString();
    Maps.geocode(Maps.getPosition(), function(results){
      $scope.signal.address = results[0].formatted_address;
      //console.log(['Position Changed',results]);
    })
  });

  Maps.addListener('boundsChanged', function(){
    Maps.setPosition(Maps.getCenter());
  });

  $scope.init = function(){
    // after initial state load
    $timeout(function() {
      Maps.init($scope.map, document.getElementById('autocomplete'));
    });
  }

  $scope.map = {
      control: {},
      options: {
            streetViewControl: false,
            panControl: false,
            maxZoom: 20,
            minZoom: 3
        },
        center: {
          latitude: 42.7,
          longitude: 23.3
        },
      zoom: 15
  };

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

  $scope.reset = function(){
    $scope.signal = new Signal();
  }
});
