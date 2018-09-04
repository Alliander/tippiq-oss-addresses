'use strict';

var should = require('should/as-function');

var BaseModel = require('./base-model');

// TODO: mock DB-connection
// currently disabled because unmocking doesn't work with Knex, see https://github.com/colonyamerican/mock-knex/pull/13

describe('the base model', function () {
  var model;
  var dbObject;
  var jsObject;

  before(function () {
    model = new BaseModel();

    dbObject = {
      foo: 'bar',
      'column_name': 'bar'
    };

    jsObject = {
      foo: 'bar',
      columnName: 'bar'
    };
  });

  describe('parsing a model from the db to a model', function () {
    it('should convert all properties to camelcase', function () {
      should.deepEqual(model.parse(dbObject), jsObject);
    });
  });

  describe('parsing a model from to a db model', function () {
    it('should convert all properties to snake case', function () {
      should.deepEqual(model.format(jsObject), dbObject);
    });
  });
});
