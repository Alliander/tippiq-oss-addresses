'use strict';

exports.uppercase = uppercase;
exports.mapModelsToIds = mapModelsToIds;
exports.mapModelToId = mapModelToId;
exports.defaultIfUndefined = defaultIfUndefined;
exports.bookshelfOptions = bookshelfOptions;

function uppercase(input) {
  return input ? input.toUpperCase() : input;
}

function mapModelsToIds(models) {
  return models.map(mapModelToId);
}

function mapModelToId(model) {
  return model.get('id');
}

function defaultIfUndefined(value, defaultValue) {
  if (typeof value !== 'undefined') {
    return value;
  }
  return defaultValue;
}

function bookshelfOptions(transaction) {
  var options = {};
  if (transaction) {
    options.transacting = transaction;
  }
  return options;
}
