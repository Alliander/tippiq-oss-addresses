'use strict';

var ValidationError = require('./errors/validation-error');
var geojsonhint = require('geojsonhint');
var uuidFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
var propertyFormat = /^[a-z][a-zA-Z0-9]+$/;
/* jshint -W101 */ // Line below is too long but can't be broken down
var emailFormat = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/i;
/* jshint +W101 */

exports.isValidUUID = isValidUUID;
exports.isValidDocumentPropertyFormat = isValidDocumentPropertyFormat;
exports.isValidImagePropertyFormat = isValidImagePropertyFormat;
exports.isStringLengthBetween = isStringLengthBetween;
exports.validateFieldExistsAndHasLengthBetween = validateFieldExistsAndHasLengthBetween;
exports.isValidStringMaxLength = isValidStringMaxLength;
exports.isValidEmailAddress = isValidEmailAddress;
exports.isValidPassword = isValidPassword;
exports.isValidAddressType = isValidAddressType;
exports.isValidGeoJson = isValidGeoJson;
exports.validateFieldExists = validateFieldExists;

function isValidUUID(input) {
  return uuidFormat.test(input);
}

function isValidDocumentPropertyFormat(input) {
  return propertyFormat.test(input);
}

function isValidImagePropertyFormat(input) {
  return propertyFormat.test(input);
}

function isStringLengthBetween(input, min, max) {
  if (typeof input === 'undefined' || input === null) {
    return false;
  }

  if (input.length < min || input.length > max) {
    return false;
  }

  return true;
}

// TODO: refactor isStringLengthBetween and validateFieldExistsAndHasLengthBetween together

function validateFieldExistsAndHasLengthBetween(fieldValue, fieldName, min, max) {
  if (typeof fieldValue === 'undefined' ||
      fieldValue === null ||
      fieldValue.length < min ||
      fieldValue.length > max) {
    throw new ValidationError(
      'Invalid ' + fieldName + ': length should be a minimum of ' + min + ' and a maximum of ' + max + ' characters.');
  }
}

function isValidStringMaxLength(input, max) {
  if (typeof input !== 'undefined' && input !== null && input.length > max) {
    return false;
  }

  return true;
}

function isValidEmailAddress(input) {
  return emailFormat.test(input);
}

function isValidPassword(password) {
  if (typeof password !== 'string' || password.length < 3) {
    return false;
  }

  return true;
}

function isValidAddressType(type) {
  var validTypes = ['NetherlandsAddress', 'ProvinceAddress', 'MunicipalityAddress',
    'CityAddress', 'ZipcodeAddress', 'StreetAddress', 'HouseAddress'];

  return validTypes.indexOf(type) > -1;
}

function isValidGeoJson(geoJson) {
  var errors = geojsonhint.hint(geoJson);
  return errors.length < 1;
}

function validateFieldExists(object, fieldName) {
  if (!object.hasOwnProperty(fieldName)) {
    throw new ValidationError(
      'Invalid field \'' + fieldName + '\': it should exist.');
  }
}
