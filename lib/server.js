var apiLogger = require('./logger');
var WebSocketServer = require('websocket').server;

var generateAPI = require("./api");
var configure = require("./configure");


module.exports = function(httpServer, config) {
  apiLogger.info("Setting up WebSocket connection");

  var wsServer = new WebSocketServer({
    httpServer: httpServer
  });

  var api = generateAPI(wsServer);
  configure(wsServer, api, config);

  return {api: api};
};