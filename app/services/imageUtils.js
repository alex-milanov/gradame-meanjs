"use strict"

var path = require('path');
var fs = require('fs');
var q = require('q');
var _ = require('lodash');
var moment = require('moment');

module.exports = function() {

	var imageUtilsService = {};

	// todo move to conf
	var baseImageUrl = 'img'
	var baseImageDir = path.join(__dirname,'../../public',baseImageUrl);

	var resourceDirs = {
		'user': 'users',
		'signal': 'signals'
	}

	var promiseMovedFile = function(sourcePath, destPath){

	}

	var promiseCreatedDir = function(dirPath){
		
	}


	var decodeBase64Image = function(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
		response = {};

		if (matches && matches.length !== 3) {
			return null;
		}

		if (matches[1] == 'image/png') {
			response.ext = '.png';
		} else if (matches[1] == 'image/jpg') {
			response.ext = '.jpg';
		} else if (matches[1] == 'image/jpeg') {
			response.ext = '.jpeg';
		} else {
			return null;
		}

		response.data = new Buffer(matches[2], 'base64');

		return response;
	};

	imageUtilsService.decodeBase64Image = decodeBase64Image;

	// todo convert to promise
	imageUtilsService.processedImagesForResource = function(imageFiles, identifier, resource, fromDataUrl){
		
		console.log(imageFiles, identifier, resource);
		var basePath = path.join(baseImageDir,resourceDirs[resource],identifier+'');
		var baseUrl = path.join(baseImageUrl,resourceDirs[resource],identifier+'');
		var images = []
		if(!fs.existsSync(basePath) || !fs.statSync(basePath).isDirectory()){
			fs.mkdirSync(basePath);
		}

		_.forIn(imageFiles, function(file, key) {
			var ext, fileData;


			if(fromDataUrl){
				var response = decodeBase64Image(file);
				ext = response.ext;
				fileData = response.data;
			} else {
				ext = file.name.substr(file.name.lastIndexOf('.'));
				fileData = fs.readFileSync(file.path);
			}

			var baseName = identifier + '_' + moment() + ext;
			images.push(path.join(baseName));
				
			fs.writeFileSync(basePath + '/' + baseName, fileData);

			if(file.path)
				fs.unlinkSync(file.path);
		})
		return images;
	}



	return imageUtilsService;

}