/* eslint-disable no-undefined */
'use strict';

var expect = require('chai').expect;
var _ = require('lodash');

var textsearchUtils = require('./textsearch-utils');

// TODO: mock DB-connection
// currently disabled because unmocking doesn't work with Knex, see https://github.com/colonyamerican/mock-knex/pull/13

describe('Textsearch utils', function () {
  describe('wordArrayToTsQuery', function () {
    it('should convert a single element array to a valid tsquery ', function () {
      expect(textsearchUtils.wordArrayToTsQuery(['a'])).to.equal('a:*');
    });
    it('should convert undefined to an empty string', function () {
      expect(textsearchUtils.wordArrayToTsQuery(undefined)).to.equal('');
    });
    it('should convert an empty array to an empty string', function () {
      expect(textsearchUtils.wordArrayToTsQuery([])).to.equal('');
    });
    it('should convert an empty string to an empty string', function () {
      expect(textsearchUtils.wordArrayToTsQuery('')).to.equal('');
    });
    it('should throw an exception when the input is not an array', function () {
      expect(textsearchUtils.wordArrayToTsQuery.bind(textsearchUtils, 'a')).to.throw(Error);
    });
    it('should convert an array to a valid tsquery ', function () {
      expect(textsearchUtils.wordArrayToTsQuery(['a', 'b'])).to.equal('a:*&b:*');
    });
  });

  describe('tsToTsVector', function () {
    it('should wrap the argument in a to_tsvector call', function () {
      expect(textsearchUtils.tsToTsVector('a')).to.equal('to_tsvector(a)');
    });
    it('should throw an Error when column is not set', function () {
      expect(textsearchUtils.tsToTsVector.bind(textsearchUtils, undefined)).to.throw(Error);
      expect(textsearchUtils.tsToTsVector.bind(textsearchUtils, null)).to.throw(Error);
      expect(textsearchUtils.tsToTsVector.bind(textsearchUtils, '')).to.throw(Error);
    });
  });

  describe('tsSetWeight', function () {
    it('should wrap the arguments in a setweight call', function () {
      expect(textsearchUtils.tsSetWeight('a', 'A')).to.equal('setweight(a,\'A\')');
    });
    it('should throw an Error when weight is not uppercase a-d', function () {
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, 'a', 'a')).to.throw(Error);
    });
    it('should throw an Error when weight is not between A-D', function () {
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, 'a', 'E')).to.throw(Error);
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, 'a', 'Z')).to.throw(Error);
    });
    it('should throw an Error when weight is not a letter', function () {
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, 'a', '0')).to.throw(Error);
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, 'a', '9')).to.throw(Error);
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, 'a', '')).to.throw(Error);
    });
    it('should throw an Error when vector is not set', function () {
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, undefined, 'A')).to.throw(Error);
      expect(textsearchUtils.tsSetWeight.bind(textsearchUtils, null, 'A')).to.throw(Error);
    });
  });

  describe('concatTsVectors', function () {
    it('should concatenate all array elements using textsearch concatenation', function () {
      expect(textsearchUtils.concatTsVectors(['a', 'b'])).to.equal('a||b');
    });
    it('should return the first element of a single element array', function () {
      expect(textsearchUtils.concatTsVectors(['a'])).to.equal('a');
    });
    it('should return an emtpy string for an empty array', function () {
      expect(textsearchUtils.concatTsVectors([])).to.equal('');
    });
    it('should throw an Error when vectors is not set', function () {
      expect(textsearchUtils.concatTsVectors.bind(textsearchUtils, undefined)).to.throw(Error);
      expect(textsearchUtils.concatTsVectors.bind(textsearchUtils, null)).to.throw(Error);
    });
    it('should throw an Error when vectors is not like an array', function () {
      expect(textsearchUtils.concatTsVectors.bind(textsearchUtils, 'a')).to.throw(Error);
      expect(textsearchUtils.concatTsVectors.bind(textsearchUtils, {})).to.throw(Error);
    });
  });

  describe('decodePartialZipcode', function () {
    it('should decode all zipcodes from string array to zipcode objects', () =>
      textsearchUtils
        .decodePartialZipcodes(['1234AB', '2345EF'])
        .map(function (result) {
          expect(result).has.property('digits');
          expect(result).has.property('letters');
        })
    );
    it('should return an empty collection when there are no zipcodes', () =>
      textsearchUtils
        .decodePartialZipcodes(['no', 'zipcode', '1234'])
        .then(function (result) {
          expect(result).to.have.length(0);
        })
    );
    it('should uppercase the zipcode letters', () =>
      textsearchUtils
        .decodePartialZipcodes(['1234ab'])
        .then(function (zipcodes) {
          expect(zipcodes[0]).to.have.property('letters', 'AB');
        })
    );
    it('should detect incomplete zipcodes with only 1 letter', () =>
      textsearchUtils
        .decodePartialZipcodes(['1234A'])
        .then(function (zipcodes) {
          expect(zipcodes[0]).to.have.property('letters', 'A');
        })
    );
  });

  describe('addressModelSerialize', function () {
    var mockModel = {
      attributes: {},
      relations: []
    };
    var validOptions = {context: 'addresses_search'};

    it('should return an empty object when not used in addresses_search context', function () {
      expect(textsearchUtils.addressModelSerialize({}, '', [], {context: 'unknownContext'})).to.deep.equal({});
    });

    it('should add the type to the ', function () {
      expect(textsearchUtils.addressModelSerialize(mockModel, 'MockType', ['name'], validOptions))
        .to.deep.equal({type: 'MockType'});
    });

    it('should unmarshal the JSON in the geometry attribute', function () {
      var geometryModel = _.chain(mockModel).set('attributes.geometry', '{"name":"mock"}').value();
      expect(textsearchUtils.addressModelSerialize(geometryModel, 'Geometry', ['geometry'], validOptions))
        .to.have.property('geometry').deep.equal({name: 'mock'});
    });

    it('should only return the attributes specfied', function () {
      var filteredModel = _
        .chain(mockModel)
        .set('attributes.name', 'filtered')
        .set('attributes.garbage', 'litter')
        .value();
      var filteredModelSerialize = textsearchUtils
        .addressModelSerialize(filteredModel, 'Filtered', ['name'], validOptions);
      expect(filteredModelSerialize).to.have.property('name', 'filtered');
      expect(filteredModelSerialize).to.not.have.property('garbage');
    });
  });
});
