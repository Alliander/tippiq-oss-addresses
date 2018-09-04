'use strict';

const chai = require('chai');
const expect = chai.expect;
const BPromise = require('bluebird');
const promiseUtils = require('./promise-utils');

describe('the promise utils', function () {
  const aCollection = [
    { test: 'test1' },
    { test: 'test2' }
  ];

  it('should return a promise collection', done => {
    expect(promiseUtils.mapCollectionToPromiseCollection).to.be.a('function');
    BPromise.resolve(promiseUtils.mapCollectionToPromiseCollection(aCollection))
      .then(testItems => {
        expect(testItems.length).to.equal(aCollection.length);
        expect(testItems[0].value()).to.equal(aCollection[0]);
        expect(testItems[1].value()).to.equal(aCollection[1]);
        done();
      })
      .catch(e => {
        done(e.message);
      });
  });
});
