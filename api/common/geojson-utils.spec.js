'use strict';

var should = require('should');
var geojsonUtils = require('./geojson-utils');

// TODO: mock DB-connection
// currently disabled because unmocking doesn't work with Knex, see https://github.com/colonyamerican/mock-knex/pull/13

describe('the GeoJSON utils', function () {
  describe('converting a lat long to a GeoJSON object', function () {
    var output;

    before(function () {
      output = {
        type: 'Point',
        coordinates: [0.42, 42]
      };
    });

    it('should return a valid GeoJSON object', function () {
      should.deepEqual(geojsonUtils.latLonToGeojson(42, 0.42), output);
    });

    it('should convert input as strings to floating point numbers', function () {
      should.deepEqual(geojsonUtils.latLonToGeojson('42', '0.42'), output);
    });
  });
});
