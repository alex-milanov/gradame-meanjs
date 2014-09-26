app.factory('TokenHandler', ['$cookies', function() {
  return {
    set: function(token) {
      $cookies.token = token
    },
    get: function() {
      return $cookies.token;
    },
    clear: function() {
      delete $cookies.token;
    }
  }
}]);
