'use strict';

app.controller('SignalsCtrl', function ($scope, $location, $http, $timeout, Signal, Maps) {
  //$scope.signal = new Signal();
  $scope.signals = [];

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
  $scope.$on('mapPositionChanged',function(event, position){
    $scope.filter.location = position.toString()
    // not sure if needed
    if(Maps.getBounds())
      $scope.filter.bounds = Maps.getBounds().toString();
  })

  $scope.$on('mapBoundsChanged',function(event, bounds){
    $scope.filter.bounds = bounds.toString();
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

  $scope.init = function() {
    $timeout(function() {
      var acOptions = {
        types: ['geocode']
      };
      var autocompleteEl = document.getElementById('autocomplete');
      // set up autocomplete
      var autocomplete = new google.maps.places.Autocomplete(autocompleteEl,acOptions);
      
      Maps.getMap(function(map){
        autocomplete.bindTo('bounds',map);

        // handle autocomplete choices
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();

          Maps.setPosition(place.geometry.location);

        });
        $scope.load();
      });

    });
  }
  
  // general load
  $scope.load = function(params){

    if(!params)
      var params = {};

    // don't autoload
    if($scope.filter.bounds && $scope.filter.bounds != ""){
      params["bounds"] = $scope.filter.bounds;
    } else if(Maps.getBounds() && Maps.getBounds().toString()!=''){
      params["bounds"] = Maps.getBounds().toString();
    } else {
      return;
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

  $scope.init();

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
