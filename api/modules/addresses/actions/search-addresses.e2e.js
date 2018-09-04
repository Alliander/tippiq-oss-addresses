'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../../../api').app;
const specUtils = require('./../../../test/spec-utils');

describe('GET /addresses/search', () => {
  const API_SEARCH_ADDRESSES_URL = '/api/addresses/search';

  it('should require max and query values as query parameters', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '8', query: 'abc'})
      .set('Accept', 'application/json')
      .expect(200)
      .end(specUtils.endHandler(done));
  });

  it('should contain at least one result when searching for an existing city', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '8', query: 'Amsterdam'})
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of.at.least(1))
      .expect(res => res.body.every((address) => {
        expect(address).to.have.property('geometry');
        expect(address).to.have.property('type');
      }))
      .end(specUtils.endHandler(done));
  });

  it('should contain at least one result when searching for an existing zipcode', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '8', query: '1011AB'})
      .set('Accept', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.length.of.at.least(1);
        return res.body.every((address) => {
          expect(address).to.have.property('geometry');
          expect(address).to.have.property('type');
        });
      })
      .end(specUtils.endHandler(done));
  });

  it('should return for a full address with addition search', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '8', query: 'De Ruijterkade 105 H, 1011 AB, Amsterdam'})
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(1))
      .expect(res => expect(res.body[0]).to.have.property('streetName', 'De Ruijterkade'))
      .expect(res => expect(res.body[0]).to.have.property('addition', 'H'))
      .expect(res => expect(res.body[0]).to.have.property('letter', ''))
      .end(specUtils.endHandler(done));
  });

  it('should return for a full address with letter search', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '8', query: 'De Ruijterkade 112 A, 1011 AB, Amsterdam'})
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.length.of(1))
      .expect(res => expect(res.body[0]).to.have.property('streetName', 'De Ruijterkade'))
      .expect(res => expect(res.body[0]).to.have.property('letter', 'A'))
      .expect(res => expect(res.body[0]).to.have.property('addition', ''))
      .end(specUtils.endHandler(done));
  });

  it('should require a query with at least 2 characters', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '8', query: 'a'})
      .set('Accept', 'application/json')
      .expect(400)
      .end(specUtils.endHandler(done));
  });

  it('should fail when max is less than 1', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '0', query: 'ab'})
      .set('Accept', 'application/json')
      .expect(400)
      .end(specUtils.endHandler(done));
  });

  it('should fail when max is greater than 8', (done) => {
    request(app)
      .get(API_SEARCH_ADDRESSES_URL)
      .query({max: '9', query: 'ab'})
      .set('Accept', 'application/json')
      .expect(400)
      .end(specUtils.endHandler(done));
  });
});
