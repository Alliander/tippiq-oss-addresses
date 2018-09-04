'use strict';

var BPromise = require('bluebird');

var ValidationError = require('./../../common/errors/validation-error');
var validationUtils = require('./../../common/validation-utils');

exports.validateLocation = validateLocation;

function validateLocation(location) {
  // TODO: Add validation for all address types to check if required properties are present
  return BPromise.resolve(location)
    .tap(validateObject)
    .tap(validateType)
    .tap(validateCityAddress)
    .tap(validateGeometry);
}

function validateObject(location) {
  if (typeof location === 'string') {
    throw new ValidationError('Invalid location: the location must be an object.');
  }
}

function validateType(location) {
  if (!location.address) {
    return;
  }

  if (!validationUtils.isValidAddressType(location.address.type)) {
    throw new ValidationError('Invalid type: type is not a valid AddressType.');
  }
}

function validateCityAddress(location) {
  if (!location.address || location.address.type !== 'CityAddress') {
    return;
  }

  if (!location.address.city) {
    throw new ValidationError('Invalid CityAddress: city is required.');
  }
}

function validateGeometry(location) {
  if (!location.geometry) {
    return;
  }

  if (!validationUtils.isValidGeoJson(location.geometry)) {
    throw new ValidationError('Invalid geometry: the given GeoJSON is invalid.');
  }
}
