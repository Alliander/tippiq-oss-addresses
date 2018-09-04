'use strict';

var request = require('supertest');
var specUtils = require('../../test/spec-utils');

var app = require('../../../api').app;

describe('Application /', function () {
  it('Api is up', function (done) {
    request(app)
      .get('/api')
      .set('Accept', 'application/json')
      .expect(200)
      .end(specUtils.endHandler(done));
  });
});
