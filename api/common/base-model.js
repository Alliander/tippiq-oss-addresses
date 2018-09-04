'use strict';

var reduce = require('lodash/collection/reduce');
var camelCase = require('lodash/string/camelCase');
var snakeCase = require('lodash/string/snakeCase');
var bookshelf = require('./bookshelf');

var instanceProps = {
  parse: function (attrs) {
    return reduce(attrs, function (memo, val, key) {
      memo[camelCase(key)] = val;
      return memo;
    }, {});
  },
  format: function (attrs) {
    return reduce(attrs, function (memo, val, key) {
      memo[snakeCase(key)] = val;
      return memo;
    }, {});
  },
  // via http://stackoverflow.com/a/29157174/363448
  orderBy: function (column, order) {
    return this.query(function (qb) {
      qb.orderBy(column, order);
    });
  }
};

var classProps = {};

module.exports = bookshelf.Model.extend(instanceProps, classProps);
