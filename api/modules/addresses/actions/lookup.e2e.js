'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../../../api').app;
const specUtils = require('./../../../test/spec-utils');

describe('GET /addresses/lookup', () => {
  const API_FIND_BY_TYPE_URL = '/api/addresses/lookup';

  describe('for type city', () => {
    it('should return 404 when city is not found', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'non-existing-city',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(404)
        .end(specUtils.endHandler(done));
    });

    it('should return location for a valid city', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'Amsterdam',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.cityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for city name with a dash (-)', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: '\'s-Gravenhage',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.cityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for city name with an apostrophe (\')', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: '\'t Goy',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.cityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for city name with a special character (ë)', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: '1e Exloërmond',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.cityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for city name with a space', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'Bavel AC',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.cityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should require a query with at least 2 characters', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'a',
          type: 'city'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .end(specUtils.endHandler(done));
    });
  });

  describe('for type municipality', () => {
    it('should return 404 when municipality is not found', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'non-existing-municipality',
          type: 'municipality'
        })
        .set('Accept', 'application/json')
        .expect(404)
        .end(specUtils.endHandler(done));
    });

    it('should return location for a valid municipality', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({name: 'Amsterdam', type: 'municipality'})
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.municipalityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for a municipality name with a dash (-)', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'Alphen-Chaam',
          type: 'municipality'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.municipalityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for a municipality name with an apostrophe (\')', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: '\'s-Gravenhage',
          type: 'municipality'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.municipalityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should return location for a municipality name with brackets', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'Bergen (L)',
          type: 'municipality'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .expect((res) => {
          expect(res.body).to.have.deep.property('location.geometry.coordinates');
          expect(res.body).to.have.deep.property('location.municipalityName');
        })
        .end(specUtils.endHandler(done));
    });

    it('should require a query with at least 2 characters', (done) => {
      request(app)
        .get(API_FIND_BY_TYPE_URL)
        .query({
          name: 'a',
          type: 'municipality'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .end(specUtils.endHandler(done));
    });
  });
});
