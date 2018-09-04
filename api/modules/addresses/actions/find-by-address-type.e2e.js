'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../../../api').app;

describe('POST /addresses/find-by-address-type', () => {
  const API_FIND_BY_ADDRESS_TYPE_URL = '/api/addresses/find-by-address-type';

  it('should return a validation error when address type is invalid', () =>
    request(app)
      .post(API_FIND_BY_ADDRESS_TYPE_URL)
      .send({ address: { type: 'undefined' } })
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => expect(res.body.success).to.equal(false))
      .expect(res => expect(res.body.message).to.equal('Validation error: ' +
        'Invalid type: type is not a valid AddressType.'))
  );

  it('should return location from zipcode address', () =>
    request(app)
      .post(API_FIND_BY_ADDRESS_TYPE_URL)
      .send({
        address: {
          type: 'ZipcodeAddress',
          zipcode: {
            digits: '1011',
            chars: 'AB'
          }
        }
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.property('geometry'))
      .expect(res => expect(res.body).to.have.property('zipcodeLetters'))
      .expect(res => expect(res.body).to.have.property('zipcodeDigits'))
      .expect(res => expect(res.body).to.have.property('cityName'))
      .expect(res => expect(res.body).to.have.property('municipalityName'))
      .expect(res => expect(res.body).to.have.property('provinceName'))
  );

  it('should return location from city address', () =>
    request(app)
      .post(API_FIND_BY_ADDRESS_TYPE_URL)
      .send({
        address: {
          type: 'CityAddress',
          city: 'Amsterdam',
          municipality: 'Amsterdam',
          province: 'Noord-Holland'
        }
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => expect(res.body).to.have.property('geometry'))
      .expect(res => expect(res.body).to.have.property('cityName'))
      .expect(res => expect(res.body).to.have.property('municipalityName'))
      .expect(res => expect(res.body).to.have.property('provinceName'))
  );

  it('should error when zipcode address is invalid', () =>
    request(app)
      .post(API_FIND_BY_ADDRESS_TYPE_URL)
      .send({
        address: {
          type: 'ZipcodeAddress',
          digits: '1032',
          chars: 'KL'
        }
      })
      .set('Accept', 'application/json')
      .expect(500)
  );
});
