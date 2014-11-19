'use strict'

app.provider('User', function(){
  this.$get = ['$resource', function($resource){
    var User = $resource('/users/:collectionRoute:_id/:documentRoute',{ _id: '@_id' },{
      update: {
        method: 'PUT'
      },
      me: {
        method: 'GET',
        params: {
          collectionRoute: 'me'
        }
      }
    });
    return User;
  }];
});