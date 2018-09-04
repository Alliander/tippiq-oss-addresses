'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_cities',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'CityAddress',
      [
        'cityName',
        'municipalityName',
        'provinceName',
        'geometry',
        'geojson'
      ],
      options);
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
