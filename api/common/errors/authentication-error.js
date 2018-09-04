'use strict';

function AuthenticationError(message) {
  this.message = message;
  this.name = 'AuthenticationError';
  Error.captureStackTrace(this, AuthenticationError);
}
AuthenticationError.prototype = Object.create(Error.prototype);
AuthenticationError.prototype.constructor = AuthenticationError;

module.exports = AuthenticationError;
