'use strict';

function AddressLookupError(message) {
  this.message = message;
  this.name = 'AddressLookupError';
  Error.captureStackTrace(this, AddressLookupError);
}
AddressLookupError.prototype = Object.create(Error.prototype);
AddressLookupError.prototype.constructor = AddressLookupError;

module.exports = AddressLookupError;
