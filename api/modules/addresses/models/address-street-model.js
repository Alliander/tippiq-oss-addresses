'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_streets',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'StreetAddress',
      [
        'streetName',
        'cityName',
        'provinceName',
        'geometry'
      ],
      options);
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
