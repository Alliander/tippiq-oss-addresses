'use strict';

const debug = require('debug')('tippiq:addresses:actions:find-by-address-type');

const LocationRepository = require('../../locations/location-repository');
const LocationValidation = require('../../locations/location-validation');
const routeUtils = require('./../../../common/route-utils');
const ValidationError = require('./../../../common/errors/validation-error');

exports.responseHandler = responseHandler;

function responseHandler(req, res) {
  LocationValidation.validateLocation(req.body)
    .then((location) => LocationRepository.parseLocationJson(location))
    .then(locationModel => {
      res.status(200).send(locationModel.serialize({
        context: 'location'
      }));
    })
    .catch(ValidationError, (e) => {
      routeUtils.sendError(res, 400, `Validation error: ${e.message}`);
    })
    .catch((e) => {
      debug(e);
      routeUtils.sendError(res, 500, 'Server error');
    });
}
