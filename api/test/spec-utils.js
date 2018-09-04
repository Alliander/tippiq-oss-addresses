'use strict';

const expect = require('chai').expect;
const debug = require('debug')('tippiq:test:spec-utils');

exports.uuidRegexString = '[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}';
exports.endHandler = endHandler;
exports.promisifyEndHandler = promisifyEndHandler;
exports.indexOfObjectWithKeyValue = indexOfObjectWithKeyValue;
exports.resultHasAtLeastLength = resultHasAtLeastLength;

function endHandler(done) {
  return function (err, res) {
    if (err) {
      debug(JSON.stringify({
        errorMessage: err.toString(),
        body: res.body
      }, null, 2));
      done(err);
    } else {
      done();
    }
  };
}

function promisifyEndHandler(resolve, reject) {
  return function (err, res) {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  };
}

function indexOfObjectWithKeyValue(array, key, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return i;
    }
  }
  return null;
}

function resultHasAtLeastLength(n) {
  return function (res) {
    expect(res.body).to.have.length.of.at.least(n);
  };
}
