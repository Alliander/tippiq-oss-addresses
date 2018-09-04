'use strict';
const BPromise = require('bluebird');

exports.mapCollectionToPromiseCollection = mapCollectionToPromiseCollection;

function mapCollectionToPromiseCollection(collection) {
  return collection.map(BPromise.resolve);
}
