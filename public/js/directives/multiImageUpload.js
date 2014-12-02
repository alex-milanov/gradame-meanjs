"use strict"
  app.directive('multiImageUpload', ['$q', '$timeout', function($q, $timeout) {

  	var URL = window.URL || window.webkitURL;

    var bindFileInput = function(el, callback){
      var fileInput = $("<input type='file' />");

      el.click(function(){
        fileInput.click();
      })

      fileInput.bind('change', callback);

    }

    var resizeImage = function (origImage, maxSize, resizeMethod, type, quality) {
      var deferred = $q.defer();
      var canvas = document.createElement('canvas');
      canvas.style.visibility = 'hidden';

      var height = origImage.height;
      var width = origImage.width;
      var posX = 0; 
      var posY = 0;

      switch(resizeMethod){
        case 'fit':
        default:
          if (width > height) {
            if (width > maxSize) {
                height = Math.round(height *= maxSize / width);
                width = maxSize;
            }
          } else {
            if (height > maxSize) {
                width = Math.round(width *= maxSize / height);
                height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          break;
        case 'crop':
          if (width > height) {
            if(height > maxSize){
              width = Math.round(width *= maxSize / height);
              height = maxSize;
              posX = Math.round((maxSize-width)/2);
            }
          } else {
            if (width > maxSize) {
              height = Math.round(height *= maxSize / width);
              width = maxSize;
              posY = Math.round((maxSize-height)/2);
            }
          }
          canvas.width = maxSize;
          canvas.height = maxSize;
          break;

      }


      
      //draw image on canvas
      var ctx = canvas.getContext("2d");
      ctx.drawImage(origImage, posX, posY, width, height);

      $timeout(function() {
        var img = canvas.toDataURL(type, quality);
        deferred.resolve(img);
      });

      return deferred.promise;
    }

    var createImage = function(url) {
      var deferred = $q.defer();
      var image = new Image();
      image.src = url;
      image.onload = function() {
        deferred.resolve(image);
      };
      return deferred.promise;
    };

    var fileToDataURL = function (file) {
      var deferred = $q.defer();
      var reader = new FileReader();
      reader.onload = function (e) {
        deferred.resolve(e.target.result);
      };
      reader.readAsDataURL(file);
      return deferred.promise;
    };

    return {
      restrict: 'A',
      scope: {
        imageModel: '=',
        maxSize: '@?',
        thumbSize: '@?',
        resizeQuality: '@?'
      },
      link: function (scope, element, attrs, ctrl) {
        console.log('multiImageUpload linker called');

        var processImage = function(file){

          var imageResult = {
            file: file,
            url: URL.createObjectURL(file)
          };

          if(scope.maxSize ||  scope.thumbSize) {
            createImage(imageResult.url).then(function(image) {

              var resizePromises = [];

              if(scope.maxSize){
                resizePromises.push(resizeImage(image, scope.maxSize, 'fit','image/png',0.7).then(function(dataUrl){
                  var imageType = dataUrl.substring(5, dataUrl.indexOf(';'));
                  return {
                    maxSize: {
                      dataUrl: dataUrl,
                      type: imageType
                    }
                  };
                }));
              }
              if(scope.thumbSize){
                resizePromises.push(resizeImage(image, scope.thumbSize, 'crop','image/png',0.7).then(function(dataUrl){
                  var imageType = dataUrl.substring(5, dataUrl.indexOf(';'));
                  return {
                    thumbSize: {
                      dataUrl: dataUrl,
                      type: imageType
                    }
                  };
                }));
              }

              if(resizePromises.length > 0){
                $q.all(resizePromises).then(function(resizeResult){
                  
                  for(var i in resizeResult){
                    imageResult = _.merge(imageResult,resizeResult[i]);
                  }
                  console.log(imageResult);
                  
                  $timeout(function() {
                    scope.$apply(function() {
                      console.log(scope);
                      scope.imageModel.push(imageResult);
                    });
                  });
                });
              }
              
            });
          } else {
            $timeout(function() {
              scope.$apply(function() {
              	console.log(scope);
                scope.imageModel.push(imageResult);
              });
            });
          }
        }

        var fileUploadCallback = function(event){
          console.log({msg: 'fileSelected', 'resource': event.target.files});
          if(!scope.imageModel){
          	scope.imageModel = [];
          }

          var files = event.target.files;
          angular.forEach(files, processImage);
        }

        bindFileInput(element, fileUploadCallback);
      }
    }
  }]);