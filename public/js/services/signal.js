app.factory('Signal', ['$resource', function($resource) {
  var imageAppenderTransform = function (data) {
    var formData = new FormData();
    // need to convert our json object to a string version of json otherwise
    // the browser will do a 'toString()' on the object which will result
    // in the value '[Object object]' on the server.

    var images = data.images;
    delete data.images;

    for (var i in data){
      if (i.charAt(0) != "$")
        formData.append(i, data[i]);
    }

    if(images && images.length){
      for (var i = 0; i < images.length; i++) {
        formData.append('images[]', images[i].maxSize.dataUrl);
        formData.append('images[]', images[i].thumbSize.dataUrl);
      }
    }

    return formData;
  }

  var defaultActions = {
    save: {
      method: 'POST',
      headers: {'Content-Type': undefined},
      transformRequest: imageAppenderTransform
    },
    update: {
      method: 'PUT',
      headers:{'Content-Type': false}
    },
    activitiesAdd: {
      method: 'POST',
      isArray: false,
      params: {
        memberRoute: 'activities'
      }
    },
    findNear: {
      method: 'GET',
      isArray: true,
      params: {
        collectionRoute: 'near'
      }
    }
  }

  var Signal = $resource('/api/signals/:collectionRoute:_id/:memberRoute', { _id: '@_id' }, defaultActions);

  return Signal;
}]);
