'use strict';

var BaseModel = require('../../common/base-model');

var textsearchUtils = require('../../common/textsearch-utils');
var _ = require('lodash');
var debug = require('debug')('tippiq:locations:model');

var instanceProps = {
  tableName: 'location',
  serialize: function (options) {
    options = _.defaults(options, {omitPivot: true});
    switch (options.context) {
      case 'card':
      case 'card-stream':
      case 'card-cta-redirect':
      case 'organization':
      case 'service':
      case 'email:weekly-notification':
        return _.chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick(function (value, key) {
            return (key === 'distance') || _.identity(value);
          })
          .omit(['id', 'card', 'location'])
          .transform(textsearchUtils.unmarshallGeoJsonFromGeometry)
          .value();

      case 'place':
        return _.chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'type',
            'geometry',
            'nr',
            'addition',
            'letter',
            'streetName',
            'zipcodeLetters',
            'zipcodeDigits',
            'cityName',
            'municipalityName',
            'provinceName',
            'buildingType'
          ])
          .transform(textsearchUtils.unmarshallGeoJsonFromGeometry)
          .value();

      case 'location':
        return _.chain(BaseModel.prototype.serialize.apply(this, [options]))
          .pick([
            'type',
            'geometry',
            'nr',
            'addition',
            'letter',
            'streetName',
            'zipcodeLetters',
            'zipcodeDigits',
            'cityName',
            'municipalityName',
            'provinceName',
            'buildingType'
          ])
          .value();

      case 'organization:partner':
        return {};

      default:
        debug('unknown serialization context \'%s\'', options.context);
        return {};
    }
  },
  updateWith: function (update) {
    this.set({
      type: update.type,
      geometry: update.geometry,
      nr: update.nr,
      addition: update.addition,
      letter: update.letter,
      streetName: update.streetName,
      zipcodeLetters: update.zipcodeLetters,
      zipcodeDigits: update.zipcodeDigits,
      cityName: update.cityName,
      municipalityName: update.municipalityName,
      provinceName: update.provinceName,
      buildingType: update.buildingType
    });
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
