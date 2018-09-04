'use strict';

function WeeklyNotificationError(message, cause) {
  this.message = message;
  if (cause) {
    this.cause = cause;
  }
  this.name = 'WeeklyNotificationError';
  Error.captureStackTrace(this, WeeklyNotificationError);
}
WeeklyNotificationError.prototype = Object.create(Error.prototype);
WeeklyNotificationError.prototype.constructor = WeeklyNotificationError;

module.exports = WeeklyNotificationError;
