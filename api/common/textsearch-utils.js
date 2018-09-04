'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');
var BaseModel = require('./base-model');

exports.wordArrayToTsQuery = wordArrayToTsQuery;
exports.tsToTsVector = tsToTsVector;
exports.tsSetWeight = tsSetWeight;
exports.concatTsVectors = concatTsVectors;
exports.decodePartialZipcodes = decodePartialZipcodes;
exports.addressModelSerialize = addressModelSerialize;
exports.unmarshallGeoJsonFromGeometry = unmarshallGeoJsonFromGeometry;

var tsToTsVectorTemplate = _.template('to_tsvector(${column})');
var tsSetWeightTemplate = _.template('setweight(${vector},\'${weight}\')');
var partialZipcodePattern = /^([1-9][0-9]{3})([a-z]{1,2})$/i;

function wordArrayToTsQuery(strings) {
  strings = strings || [];

  if (!(strings instanceof Array)) {
    throw new Error('strings must be an Array');
  }

  return strings
    .map(function (string) {
      return string + ':*';
    })
    .join('&');
}

function tsToTsVector(column) {
  if (!column) {
    throw new Error('column is mandatory');
  }
  return tsToTsVectorTemplate({column: column});
}

function tsSetWeight(vector, weight) {
  if (!vector) {
    throw new Error('vector is mandatory');
  }
  if (!weight.match(/^[A-D]$/)) {
    throw new Error('weight is mandatory must be between A and D');
  }
  return tsSetWeightTemplate({vector: vector, weight: weight});
}

function concatTsVectors(vectors) {
  if (!vectors) {
    throw new Error('vectors is mandatory');
  }
  if (!(vectors.join)) {
    throw new Error('vectors must be joinable');
  }
  return vectors.join('||');
}

/**
 * Filter all zipcode like strings from the input array and convert them to an object containing a digits and
 * uppercase letters property.
 * Zipcode like means: 4 digits followed by 1 or 2 characters.
 * @param {Array} strings Array of strings
 * @returns {Promise.<Collection>} containing zipcode objects
 */
function decodePartialZipcodes(strings) {
  return BPromise
    .filter(strings, function (string) {
      return partialZipcodePattern.test(string);
    })
    .map(function (string) {
      var parts = partialZipcodePattern.exec(string);
      return {
        digits: parts[1],
        letters: parts[2].toUpperCase()
      };
    });
}

function addressModelSerialize(model, modelType, fields, options) {
  options = options || {};
  switch (options.context) {
    case 'address':
      return _
        .chain(BaseModel.prototype.serialize.apply(model, [options]))
        .pick(fields)
        .set('type', modelType)
        .value();

    case 'addresses_search':
      return _
        .chain(BaseModel.prototype.serialize.apply(model, [options]))
        .pick(fields)
        .set('type', modelType)
        .transform(unmarshallGeoJsonFromGeometry)
        .value();
    case 'addresses_find_by_location':
      return _
        .chain(BaseModel.prototype.serialize.apply(model, [options]))
        .pick(fields)
        .mapKeys((value, key) => {
          // Rename geojson to geometry for unmarshallGeoJsonFromGeometry function
          return key === 'geojson' ? 'geometry' : key;
        })
        .transform(unmarshallGeoJsonFromGeometry)
        .set('type', modelType)
        .value();

    default:
      require('debug')('tippiq:addresses:model:' + modelType)('unknown serialization context \'%s\'', options.context);
      return {};
  }
}

function unmarshallGeoJsonFromGeometry(that, value, key) {
  _.set(that, key, key === 'geometry' && typeof value === 'string' ? JSON.parse(value) : value);
}
