'use strict';

function EventBusError(message) {
  this.message = message;
  this.name = 'EventBusError';
  Error.captureStackTrace(this, EventBusError);
}
EventBusError.prototype = Object.create(Error.prototype);
EventBusError.prototype.constructor = EventBusError;

module.exports = EventBusError;
