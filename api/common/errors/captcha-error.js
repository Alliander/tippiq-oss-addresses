'use strict';

function CaptchaError(message) {
  this.message = message;
  this.name = 'CaptchaError';
  Error.captureStackTrace(this, CaptchaError);
}
CaptchaError.prototype = Object.create(Error.prototype);
CaptchaError.prototype.constructor = CaptchaError;

module.exports = CaptchaError;
