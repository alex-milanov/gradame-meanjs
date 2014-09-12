'use strict';

app.controller('SignalsCtrl', function ($scope, $location, $http, $timeout, Signal, Maps) {
  //$scope.signal = new Signal();
  $scope.signals = Signal.query({limit: 3},
    function(data) {
      $scope.signals = data
  }, function(errData) {});

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

  $scope.filter = {
    bounds: "",
    location: "",
    type: "",
    status: ""
  };

  $scope.$watch('filter.type', function() {
    $scope.load();
  });
  $scope.$watch('filter.status', function() {
    $scope.load();
  });
  $scope.$watch('filter.bounds', function() {
    $scope.load();
  });

  //$scope.location

  Maps.addListener('positionChanged', function(){
    if(Maps.getPosition())
      $scope.filter.location = Maps.getPosition().toString();
    if(Maps.getBounds())
      $scope.filter.bounds = Maps.getBounds().toString();
  });

  Maps.addListener('boundsChanged', function(){
    if(Maps.getBounds())
      $scope.filter.bounds = Maps.getBounds().toString();
  });

  function displaySignals(list){
    Maps.clearMarkers();

    for(var i in list){
      if(list[i].location){
        var markerOptions = {
            position: new google.maps.LatLng(list[i].location[0], list[i].location[1]),
            icon: new google.maps.MarkerImage("/img/markers/sign.png")
          //animation: google.maps.Animation.DROP
        };

        Maps.addMarker(markerOptions)
      }
    }

    Maps.updateCluster();
  }

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

  // general load
  $scope.load = function(params){

    if(!params)
      var params = {};

    // don't autoload
    if(!$scope.filter.bounds || $scope.filter.bounds == ""){
      return;
    } else {
      params["bounds"] = $scope.filter.bounds;
    }

    if($scope.filter.type != ""){
      params["type"] = $scope.filter.type;
    }

    if($scope.filter.status != ""){
      params["status"] = $scope.filter.status;
    }

    Signal.query(params).$promise.then(function(signals){
      //console.log(signals);
      for(var i in signals){
        var signal = signals[i];

        // modifiers here

        signals[i] = signal;
      }

      $scope.signals = signals;
      displaySignals(signals);
    });

  }

  $scope.findNear = function(_callback){
    Signal.findNear({location:$scope.filter.location}).$promise.then(function(signals){
      //console.log({near: data});
      for(var i in signals){
        var signal = signals[i];

        // modifiers here

        signals[i] = signal;
      }

      $scope.signals = signals;
      _callback();
    })
  }

  //$scope.load();
});
