'use strict';

var BaseModel = require('../../../common/base-model');
var textsearchUtils = require('../../../common/textsearch-utils');

var instanceProps = {
  tableName: 'addresses_municipalities',
  serialize: function (options) {
    return textsearchUtils.addressModelSerialize(
      this,
      'MunicipalityAddress',
      [
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
