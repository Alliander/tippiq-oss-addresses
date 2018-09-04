'use strict';

const chai = require('chai');
const jwtUtils = require('./jwt-utils');
const expect = chai.expect;

describe('the JWT utils', function () {
  let dummyToken;
  const specAction = 'jwt-spec-action';
  const specSecret = 'jwt-spec-secret';

  before(done => {
    const payload = { id: 42, action: specAction };
    jwtUtils.generateToken(payload, specSecret)
      .then(token => {
        dummyToken = token;
        done();
      });
  });

  describe('generating a token', function () {
    it('should return a promise', () => {
      const promise = jwtUtils.generateToken({}, 'my-secret');
      expect(promise.then).to.be.a('function');
    });
  });

  describe('verifying a token', function () {
    it('should return a promise', () => {
      const promise = jwtUtils.verifyTokenSecretAndAction(dummyToken, specSecret, specAction);
      expect(promise.then).to.be.a('function');
    });

    it('should contain the payload as resolved value', done => {
      jwtUtils.verifyTokenSecretAndAction(dummyToken, specSecret, specAction)
        .then(jwtPayload => {
          expect(jwtPayload).to.have.property('id', 42);
          expect(jwtPayload).to.have.property('action', specAction);
          done();
        });
    });
  });

  describe('decoding a token', () => {
    it('should return a promise', () => {
      const promise = jwtUtils.decodeJwtToken(dummyToken, specSecret);
      expect(promise.then).to.be.a('function');
    });

    it('should fail for an invalid token', done => {
      jwtUtils.decodeJwtToken('invalid-token', specSecret)
        .catch(() => {
          done();
        });
    });

    it('should contain the payload for a valid token', done => {
      jwtUtils
        .decodeJwtToken(dummyToken, specSecret)
        .then(jwtPayload => {
          expect(jwtPayload).to.have.property('id', 42);
          expect(jwtPayload).to.have.property('action', specAction);
          done();
        });
    });
  });
});
