/* eslint-disable no-undefined */
'use strict';

var expect = require('chai').expect;
var validationUtils = require('./validation-utils');

describe('the validation utils', function () {
  describe('validation of a string\'s length', function () {
    it('should be invalid when a string is shorter than the minimum length', function () {
      expect(validationUtils.isStringLengthBetween('abc', 5, 10)).to.equal(false);
    });

    it('should be invalid when a string is longer than the maximum length', function () {
      expect(validationUtils.isStringLengthBetween('abc', 1, 2)).to.equal(false);
    });

    it('should be valid when a string\'s length is between the min and max', function () {
      expect(validationUtils.isStringLengthBetween('abc', 1, 4)).to.equal(true);
    });
  });

  describe('validation of a string\'s maximum length', function () {
    it('should be valid when the string is not defined', function () {
      expect(validationUtils.isValidStringMaxLength(undefined, 42)).to.equal(true);
    });

    it('should be invalid when the string is longer than its maximum length', function () {
      expect(validationUtils.isValidStringMaxLength('abc', 2)).to.equal(false);
    });
  });

  describe('validation of an email address', function () {
    it('should be valid when email address contains @ and domain', function () {
      expect(validationUtils.isValidEmailAddress('valid@gmail.com')).to.equal(true);
    });

    it('should be valid when email address contains + sign', function () {
      expect(validationUtils.isValidEmailAddress('valid+1@gmail.com')).to.equal(true);
    });

    it('should be invalid when email address doesn\'t contain @ and domain', function () {
      expect(validationUtils.isValidEmailAddress('invalid')).to.equal(false);
    });
  });
});
