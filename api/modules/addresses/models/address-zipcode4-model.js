'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_zipcodes4',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'ZipcodeAddress',
      [
        'zipcodeDigits',
        'cityName',
        'municipalityName',
        'provinceName',
        'geometry'
      ],
      options);
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
