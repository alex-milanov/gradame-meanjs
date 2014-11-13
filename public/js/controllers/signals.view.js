'use strict';

app.controller('SignalsViewCtrl', ['$scope', '$stateParams', 'Signal', function($scope, $stateParams, Signal) {
  
  $scope.load = function(){
    Signal.get({ _id: $stateParams.signalId }, function(signal) {
      $scope.signal = signal;
	  $scope.comment = '';
    })
  }

  $scope.load();

  $scope.addComment = function(comment){
    Signal.activitiesAdd({_id: $stateParams.signalId,
    	type: "comment",
    	comment: comment
    }).$promise.then(function(){
    	$scope.load();
    });
  }


}])
