'use strict';


app.controller('SignalsCtrl', function ($scope, $location, $http, Signal) {

	
	//$scope.signal = new Signal();
	$scope.signals = [];


	$scope.signalTypes = [
		"Улична дупка",
		"Липсваща шахта",
		"Висящи кабели",
		"Нерегламентиран боклук",
		"Вандализъм"
	];

	$scope.location = {};


	var autocomplete;
	var map;
	var marker;
	var sigMarkers = [];

	function updatePosition(position){
		map.setCenter(position);
		map.setZoom(15);
		marker.setPosition(position);
		marker.setAnimation(google.maps.Animation.DROP);

		$scope.location = position.toString();
		
		$scope.findNear(function(){
			displaySignals($scope.signals);
		})
		/*
		$scope.signal.location = {
			latitude : position.k,
			longitude : position.A
		};
		*/
	}

	function displaySignals(list){
		for (var i = 0; i < sigMarkers.length; i++) {
			sigMarkers[i].setMap(null);
		}
		sigMarkers = [];
		for(var i in list){
			if(list[i].location){
				var markerOptions = {
				    position: new google.maps.LatLng(list[i].location[0], list[i].location[1]),
				    map: map,
				    icon: new google.maps.MarkerImage("/img/markers/sign.png"),
					animation: google.maps.Animation.DROP
				};

				console.log(list[i].location);

				var sigMarker = new google.maps.Marker(markerOptions);
				sigMarker.setMap(map);
				sigMarkers.push(sigMarker);
			}
		}
	}
    
    navigator.geolocation.getCurrentPosition(function(position){ 	

    	map = $scope.map.control.getGMap();

		var markerOptions = {
		    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		    map: map,
			icon: new google.maps.MarkerImage("/img/markers/pin.png"),
			animation: google.maps.Animation.DROP
		};

		marker = new google.maps.Marker(markerOptions);
		marker.setMap(map);


		updatePosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));


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
    });
		


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



	// general load
	$scope.load = function(){
		 Signal.query().$promise.then(function(signals){
			//console.log(signals);
			for(var i in signals){
				var signal = signals[i];
				
				// modifiers here

				signals[i] = signal;
			}
			
			$scope.signals = signals;
		});
		
	}

	$scope.findNear = function(_callback){
		Signal.findNear({location:$scope.location}).$promise.then(function(signals){
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