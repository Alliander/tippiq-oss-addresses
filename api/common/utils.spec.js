'use strict';

var expect = require('chai').expect;

var Utils = require('./utils');

describe('Utils', function () {
  describe('uppercase', function () {
    it('should convert a string to an uppercase string', function () {
      var result = Utils.uppercase('abc');
      expect(result).to.equal('ABC');
    });
  });

  describe('map models to ids', function () {
    it('should map a list of models to a list of their ids', function () {
      var model = {
        attributes: {
          id: '42'
        },
        get: function (key) {
          return this.attributes[key];
        }
      };

      var result = Utils.mapModelsToIds([model]);
      expect(result).to.deep.equal(['42']);
    });
  });

  describe('bookshelfOptions', function () {
    it('should return an empty object when no transaction id is passed', function () {
      var result = Utils.bookshelfOptions();
      expect(result).to.eql({});
    });

    it('should return an object with the transacting id when an transaction id is passed', function () {
      var result = Utils.bookshelfOptions('1234');
      expect(result).to.eql({'transacting': '1234'});
    });
  });
});
