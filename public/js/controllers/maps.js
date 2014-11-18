"use strict"

app.controller('MapsCtrl', function ($scope, $location, $http, $timeout, Signal, Maps) {

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

	$scope.initMap = function(){
		// after initial state load
		$timeout(function() {
			Maps.init($scope.map, document.getElementById('autocomplete'));
		});
	}

})