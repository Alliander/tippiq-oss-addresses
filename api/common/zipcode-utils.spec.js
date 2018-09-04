'use strict';

var expect = require('chai').expect;
var zipcodeUtils = require('./zipcode-utils');

describe('the zipcode utils', function () {
  describe('normalizing a zipcode', function () {
    it('should return an uppercase zipcode', function () {
      expect(zipcodeUtils._normalizeZipcode('1234ab')).to.equal('1234AB');
    });

    it('should return a zipcode which is no longer than 6 characters', function () {
      expect(zipcodeUtils._normalizeZipcode('1234ABCD')).to.equal('1234AB');
    });

    it('should remove all non-alphanumeric characters', function () {
      expect(zipcodeUtils._normalizeZipcode(' 1 2 3 4 A B C D ~ / ( )')).to.equal('1234AB');
    });
  });

  describe('parsing a zipcode', function () {
    it('should normalize the zipcode', function () {
      expect(zipcodeUtils.parseZipcodeInput('1234abcd')).to.deep.equal({
        digits: '1234',
        chars: 'AB'
      });
    });

    it('should return the digits as a property', function () {
      expect(zipcodeUtils.parseZipcodeInput('1234AB').digits).to.equal('1234');
    });

    it('should return the letters as a property', function () {
      expect(zipcodeUtils.parseZipcodeInput('1234AB').chars).to.equal('AB');
    });
  });
});
