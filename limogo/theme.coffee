###*
@fileOverview ./limogo/theme.js
@description
Load LimoGo theme.
###

express = require('express')
path = require('path')

themeRouteConfig = (__interface__) ->

  ###*
  Theme Route Config
  @module limogo.app/theme
  ###

  __interface__.app.use express.static(path.join(__dirname, '../app')) # Use no view engine
  # For static generation of minified files.
  __interface__.app.use '/assets', express.static(path.join(__dirname, '../app'))
  __interface__

module.exports = themeRouteConfig

