var apiLogger = require('./logger');
var webSocketHelper = require('perspective-core-web-socket-helper');

function originIsAllowed(origin, config) {
  return origin === config.crossSiteRequest.allowedOrigin;
}

module.exports = function configure(wsServer, api, config) {

  wsServer.on('request', function(request){
    if (!originIsAllowed(request.origin, config)) {
      request.reject();
      apiLogger.info('Connection from origin ' + request.origin + ' rejected');
      return;
    }

    var connection = request.accept('perspective-protocol', request.origin);

    connection.on("message", function(message) {
      var errors = webSocketHelper.callCallbacksForMessage(message.utf8Data);

      if (errors) {
        apiLogger.info(errors);
        api('server').send("error", errors);
      }
    });

    apiLogger.info(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);
    apiLogger.info(wsServer.connections.length + ' clients connected to WS');
  });

  wsServer.on('close', function(connection) {
    apiLogger.info(connection.remoteAddress + " disconnected");
    apiLogger.info(wsServer.connections.length + ' clients connected to WS');
  });
};