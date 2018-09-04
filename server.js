#!/usr/bin/env node
'use strict';

/**
 * Module dependencies.
 */

var app = require('./api').app;
var debug = require('debug')('tippiq:server');
var http = require('http');
var config = require('./config');


/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var portString = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(portString + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(portString + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function getAddressString(addr) {
  if (typeof addr === 'string') {
    return 'pipe ' + addr;
  } else {
    return 'port ' + addr.port;
  }
}

function onListening() {
  debug('Listening on ' + getAddressString(server.address()));
}
