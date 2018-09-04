'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_houses',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'HouseAddress',
      [
        'streetName',
        'nr',
        'addition',
        'letter',
        'cityName',
        'zipcodeDigits',
        'zipcodeLetters',
        'municipalityName',
        'provinceName',
        'geometry'
      ],
      options);
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
