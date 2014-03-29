'use strict';

app.provider('Signal', function(){
	this.$get = ['$resource', function($resource){
		var Signal = $resource('/api/signals/:_id',{},{
			update: {
				method: 'PUT'
			}
		});
		return Signal;
	}];
});

app.controller('SignalsCtrl', function ($scope, $location, Signal) {

	$scope.signal = new Signal();
	$scope.signals = [];

	$scope.signalTypes = [
		"Улична дупка",
		"Липсваща шахта",
		"Висящи кабели",
		"Нерегламентиран боклук",
		"Вандализъм"
	];


	// maps
	//google.maps.visualRefresh = true;
    
	var calls = 0;

    
    navigator.geolocation.getCurrentPosition(function(position){ 	
		
			$scope.map.control.refresh({latitude: position.coords.latitude, longitude: position.coords.longitude});
	        $scope.map.control.getGMap().setZoom(15);
    	
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
	        latitude: 45,
	        longitude: -73
	    },
	    zoom: 8
	};



	// api
	$scope.load = function(){
		 Signal.query().$promise.then(function(signals){
			console.log(signals);
			for(var i in signals){
				var signal = signals[i];
				
				// modifiers here

				signals[i] = signal;
			}
			
			$scope.signals = signals;
		});
		
	}
	$scope.load();
	
	$scope.save = function(){
		if($scope.signal._id){
			Signal.update({_id:$scope.signal._id}, $scope.signal).$promise.then($scope.load)
			//$scope.signal.$save().then($scope.load);
		} else {
			var signal = $scope.signal;
			$scope.signal.$save().then($scope.load);
		}
		$scope.signal = new Signal();	
	}
	
	$scope.reset = function(){	
		$scope.signal = new Signal();
	}
	
	
	$scope.delete = function(signal){
		Signal.delete(signal).$promise.then($scope.load);
	}

});