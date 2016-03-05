
/**
@fileOverview ./limogo/caps.js
@description
1. Documentation  
2. API Mocks
 */

(function() {
  var express, middlewareConfig, path;

  express = require('express');

  path = require('path');

  middlewareConfig = function(__interface__) {

    /**
    Dev Route Config
    @module limogo.app/dev
     */
    __interface__.app.use('/bower_components', express["static"](path.join(__dirname, '../bower_components')));
    return __interface__;
  };

  module.exports = middlewareConfig;

}).call(this);
