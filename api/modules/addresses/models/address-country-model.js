'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_countries',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'NetherlandsAddress',
      [
        'countryName',
        'geometry'
      ],
      options);
  }
};

var classProps = {};

module.exports = BaseModel.extend(instanceProps, classProps);
