'use strict';

module.exports = function(app) {
  // Root routing
  var core = require('../../app/controllers/core');
  app.get('/views/*', core.views);
  app.get('/', core.index);
};