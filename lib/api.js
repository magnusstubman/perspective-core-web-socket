var apiLogger = require('./logger');
var webSocketHelper = require('perspective-core-web-socket-helper');

/*
 *  Todo
 *  Drop sending message if no one is listening on channel and event
  * */

var send = function(wsServer, channel, event, object) {
  var jsonString = webSocketHelper.createJSONString(channel, event, object);
  wsServer.connections.forEach(function(connection) {
    connection.send(jsonString);
  });
};

module.exports = function generateAPI(wsServer) {
  return function createChannel(channel) {
    return {
      send: function(event, object) {
        send(wsServer, channel, event, object);
      },
      on: function(event, callback) {
        webSocketHelper.on(channel, event, callback);
      },
      standardEvents: webSocketHelper.standardEvents
    }
  }
};