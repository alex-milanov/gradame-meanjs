app.provider('Signal', function(){
  this.$get = ['$resource', 'TokenHandler', function($resource, tokenHandler){
    var Signal = $resource('/api/signals/:collectionRoute:_id/:memberRoute',{
      _id: '@_id',
      collectionRoute: '@collectionRoute',
      memberRoute: '@memberRoute'
    },{
      query:{
        method:"GET",
        isArray:true,
        transformRequest: function(data, headersGetter){
          if(tokenHandler.get() && tokenHandler.get()!='')
            headersGetter().token = tokenHandler.get();
        }
      },
      post:{
        method:"POST",
        headers:{'Content-Type':undefined},
        transformRequest: function (data, headersGetter) {

          // add token
          if(tokenHandler.get() && tokenHandler.get()!='')
           headersGetter().token = tokenHandler.get();

          var formData = new FormData();
          //need to convert our json object to a string version of json otherwise
          // the browser will do a 'toString()' on the object which will result
          // in the value '[Object object]' on the server.

          var images = data.images;
          delete data.images;

          for(var i in data){
            if(i.charAt(0)!="$")
              formData.append(i, data[i]);
          }

          if(images && images.length){
            for(var i = 0; i < images.length; i++){
              formData.append('image_'+i, images[i]);
            }
          }

          return formData;
        }

      },
      update: {
        method: 'PUT',
        isArray:false,
        headers:{'Content-Type':false}
      },
      findNear: {
        method: 'GET',
        isArray:true,
        params: {
          collectionRoute: 'near'
        }
      }
    });

    // wrap actions does not work well here
    //Signal = tokenHandler.wrapActions( Signal, ["query"] );

    return Signal;
  }];
});
