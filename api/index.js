'use strict';

var express = require('express');
var morgan = require('morgan');
var debug = require('debug')('tippiq:server');
var accessLog = require('debug')('tippiq:access-log');
var bodyParser = require('body-parser');
var compression = require('compression');
var cors = require('cors');

var routeUtils = require('./common/route-utils');
var AddressRepository = require('./modules/addresses/address-repository');

// application setup
var app = express();
app.use(compression());
app.use(morgan('combined', { stream: { write: accessLog } }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Serve API routes
app.use('/api/addresses', require('./modules/addresses/address-routes').router);
app.use('/api/', require('./modules/app').router);
app.use('/healthcheck', require('express-healthcheck')());
app.use('/*', routeUtils.send404);

// Catch other API errors
app.use(function (err, req, res, next) {
  debug('err', err);
  if (err instanceof SyntaxError) {
    routeUtils.sendError(res, 400, 'Invalid JSON structure');
  } else if (err instanceof Error) {
    routeUtils.sendError(res, 500, 'Service (temporarily) unavailable');
  } else {
    next();
  }
});

AddressRepository
  .getVersion()
  .then(function (version) {
    // TODO use serialize
    debug('%j', version.attributes);
  });

exports.app = app;


