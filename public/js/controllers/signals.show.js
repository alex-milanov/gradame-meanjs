'use strict';

app.controller('SignalsShowCtrl', ['$scope', '$stateParams', 'Signal', function($scope, $stateParams, Signal) {
  Signal.get({ _id: $stateParams.signalId }, function(signal) {
    console.log(signal);
    $scope.signal = signal
  })
}])
