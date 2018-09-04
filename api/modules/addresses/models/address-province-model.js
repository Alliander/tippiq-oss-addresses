'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_provinces',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'ProvinceAddress',
      [
        'provinceName',
        'geometry'
      ],
      options);
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
