'use strict';

var should = require('should/as-function');

var bookshelf = require('./bookshelf');

// TODO: mock DB-connection
// currently disabled because unmocking doesn't work with Knex, see https://github.com/colonyamerican/mock-knex/pull/13

describe('the bookshelf instance', function () {
  describe('the knex configuration', function () {
    it('should have the setSRID method defined', function () {
      should(bookshelf.knex.st.setSRID).be.Function();
    });

    it('should have the distance method defined', function () {
      should(bookshelf.knex.st.distance).be.Function();
    });

    it('should have the distanceBetweenColumnAndGeoJson method defined', function () {
      should(bookshelf.knex.st.distanceBetweenColumnAndGeoJson).be.Function();
    });

    it('should have the makePoint method defined', function () {
      should(bookshelf.knex.st.dutchMakePoint).be.Function();
    });
  });
});
