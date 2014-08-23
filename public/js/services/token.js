app.factory('TokenHandler', function() {
  var tokenHandler = {};
  var token = "";

  tokenHandler.set = function( newToken ) {
    token = newToken;
  };

  tokenHandler.get = function() {
    return token;
  };

  // wrap given actions of a resource to send auth token with every
  // request
  tokenHandler.wrapActions = function( _resource, actions ) {
	
    // copy original resource
    var wrappedResource = _resource;
    for (var i=0; i < actions.length; i++) {
      tokenWrapper( wrappedResource, actions[i] );
    };
    // return modified copy of resource
    return wrappedResource;
  };

  // wraps resource action to send request with auth token
  var tokenWrapper = function( _resource, action ) {
    // copy original action
    _resource['_' + action]  = _resource[action];
    // create new action wrapping the original and sending token
    _resource[action] = function( data, success, error){
      return _resource['_' + action](
        angular.extend({}, data || {}, {token: tokenHandler.get()}),
        success,
        error
      );
    };
  };

  return tokenHandler;
});