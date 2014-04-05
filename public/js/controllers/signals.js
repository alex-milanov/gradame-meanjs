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

				//console.log(list[i].location);

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
		
		  
			updatePosition(place.geometry.location);
			var bounds = map.getBounds().toString();
	        $scope.load({bounds: bounds}); // do your job here
		    //$scope.load({bounds: map.getBounds()}); // do your job here
		  
		  
		});

		google.maps.event.addListener(map, 'zoom_changed', function () {
		    google.maps.event.addListenerOnce(map, 'bounds_changed', function (e) {
		    	//console.log(map.getBounds().toString())

		    	var bounds = map.getBounds().toString();
		    	console.log(bounds);

		        $scope.load({bounds: bounds}); // do your job here
		    });
		});

		google.maps.event.addListener(map, 'dragend', function (e) {
	    	//console.log(map.getBounds().toString())

	    	var bounds = map.getBounds().toString();

	        $scope.load({bounds: bounds}); // do your job here
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
	$scope.load = function(params){
		
		if(!params)
			var params = {};
		
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