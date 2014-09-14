app.factory('TokenHandler', function() {
  var tokenHandler = {};
  var token = "";

  tokenHandler.set = function(newToken) {
    token = newToken;
  };

  tokenHandler.get = function() {
    return token;
  };

  return tokenHandler;
});
