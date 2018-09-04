'use strict';

var should = require('should');
var stringUtils = require('./string-utils');

describe('the string utils', function () {
  describe('generating a string', function () {
    it('should generate a string with the exact given length', function () {
      var string = stringUtils.generateStringWithLength(42);
      should.equal(string.length, 42);
    });
  });
});
