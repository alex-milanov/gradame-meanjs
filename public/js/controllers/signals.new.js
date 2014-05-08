'use strict';


app.controller('SignalsNewCtrl', function ($scope, $location, $http, Signal) {

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

	var autocomplete;
	var map;
	var marker;

	function updatePosition(position){
		map.setCenter(position);
		map.setZoom(15);
		marker.setPosition(position);
		marker.setAnimation(google.maps.Animation.DROP);

		//$scope.signal.location = [position.A,position.k];
		$scope.signal.location = position.toString();

		/*
		$scope.signal.location = {
			latitude : position.k,
			longitude : position.A
		};
		*/
	}

	$scope.init = function(){
		// after initial state load
		$timeout(function() {
			map = $scope.map.control.getGMap();

			var markerOptions = {
			    position: new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude),
			    map: map,
			    icon: new google.maps.MarkerImage("/img/markers/pin.png"),
				animation: google.maps.Animation.DROP
			};

			marker = new google.maps.Marker(markerOptions);
			marker.setMap(map);

			var acOptions = {
			  types: ['geocode']
			};
			var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
			autocomplete.bindTo('bounds',map);

			google.maps.event.addListener(autocomplete, 'place_changed', function() {
			  var place = autocomplete.getPlace();
			  /*
			  if (place.geometry.viewport) {
			    map.fitBounds(place.geometry.viewport);
			  } else {
			    map.setCenter(place.geometry.location);
			    map.setZoom(15);
			  }
			  */
			  updatePosition(place.geometry.location);
			  //marker.setPosition(place.geometry.location);
			  
			});

			updatePosition(new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude));

			navigator.geolocation.getCurrentPosition(function(position){
				updatePosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
			});
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
	    zoom: 10
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
			Signal.post(signal).$promise.then(function(){
				$location.path('signals');
			});
			

		}
		//$scope.signal = new Signal();	
	}
	
	$scope.reset = function(){	
		$scope.signal = new Signal();
	}
	
	
	

});