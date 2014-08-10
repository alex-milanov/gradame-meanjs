'use strict';

app.factory('Maps',
  function () {


    var Maps = {};

    var callbacks = {
      'positionChanged' : [],
      'boundsChanged' : []
    };

    var autocomplete,
      map,
      marker,
      sigMarkers = [],
      markerClusterer = null,
      _position;


    // TODO: use angular or other lib for event handling
    Maps.addListener = function(event, callback){
      if(!callbacks[event])
        callbacks[event] = [];

      callbacks[event].push(callback);
    }

    // simple notify
    var _notify = function(event){
      for(var i in callbacks[event]){
        callbacks[event][i]();
      }
    }

    var _updatePosition = function(pos){

      map.setCenter(pos);
      map.setZoom(15);
      marker.setPosition(pos);
      marker.setAnimation(google.maps.Animation.DROP);

      _position = pos;

      _notify("positionChanged");
    };

    Maps.init = function(mapEl, autocompleteEl){
        map = mapEl.control.getGMap();

        var markerOptions = {
          position: new google.maps.LatLng(mapEl.center.latitude, mapEl.center.longitude),
          map: map,
          icon: new google.maps.MarkerImage("/img/markers/pin.png"),
          animation: google.maps.Animation.DROP
        };

        marker = new google.maps.Marker(markerOptions);
        marker.setMap(map);

        var acOptions = {
          types: ['geocode']
        };


        // set up autocomplete
        var autocomplete = new google.maps.places.Autocomplete(autocompleteEl,acOptions);
        autocomplete.bindTo('bounds',map);

        // handle autocomplete choices
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();

          _updatePosition(place.geometry.location);

        });

        // on zoom
        google.maps.event.addListener(map, 'zoom_changed', function () {
          google.maps.event.addListenerOnce(map, 'bounds_changed', function (e) {
            //$scope.filter.bounds = map.getBounds().toString();
            _notify('boundsChanged');
          });
        });

        // on dragend
        google.maps.event.addListener(map, 'dragend', function (e) {
          //$scope.filter.bounds = map.getBounds().toString();
          _notify('boundsChanged');
        });


        // init the position
        _updatePosition(new google.maps.LatLng(mapEl.center.latitude, mapEl.center.longitude));

        // get coords by gps
        navigator.geolocation.getCurrentPosition(function(pos){
          _updatePosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });

    };

    Maps.addMarker = function(markerOpts){

      if(!markerOpts.map)
        markerOpts.map = map

      var sigMarker = new google.maps.Marker(markerOpts);
      sigMarker.setMap(map);
      sigMarkers.push(sigMarker);
    }

    Maps.clearMarkers = function(){
      if(markerClusterer != null){
        markerClusterer.clearMarkers();
      }

      for (var i = 0; i < sigMarkers.length; i++) {
        sigMarkers[i].setMap(null);
      }
      sigMarkers = [];
    }


    Maps.updateCluster = function(){

      if(markerClusterer)
        markerClusterer.setMap(null);

      markerClusterer = new MarkerClusterer(map, sigMarkers, {
        maxZoom: 10,
        gridSize: 10
      });

    }


    Maps.getBounds = function(){
      return map.getBounds();
    };

    Maps.getPosition  = function(){
      return _position;
    }

    return Maps;


  });