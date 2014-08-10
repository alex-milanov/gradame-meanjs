'use strict';

app.controller('SignalsShowCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
  $scope.signalId = $stateParams.signalId;
}])
