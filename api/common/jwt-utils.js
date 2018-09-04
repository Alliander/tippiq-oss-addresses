'use strict';

const jwt = require('jsonwebtoken');
const BPromise = require('bluebird');

exports.verifyTokenSecretAndAction = verifyTokenSecretAndAction;
exports.decodeJwtToken = decodeJwtToken;
exports.generateToken = generateToken;

function verifyTokenSecretAndAction(token, secret, action, options) {
  return decodeJwtToken(token, secret, options)
    .then(payload => _validateTokenAction(payload, action));
}

function decodeJwtToken(token, secret, options) {
  var deferred = BPromise.pending();
  jwt.verify(token, secret, options || {}, function (err, decoded) {
    if (err) {
      /*
       Possible errors:
       err = {
       name: 'TokenExpiredError',
       message: 'jwt expired',
       expiredAt: 1408621000
       }
       err = {
       name: 'JsonWebTokenError',
       message: 'jwt malformed'
       message: 'jwt signature is required'
       message: 'invalid signature'
       message: 'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
       message: 'jwt issuer invalid. expected: [OPTIONS ISSUER]'
       }
       */
      deferred.reject(err);
    } else {
      deferred.resolve(decoded);
    }
  });
  return deferred.promise;
}

function _validateTokenAction(jwtPayload, action) {
  return BPromise
    .try(() => {
      if (jwtPayload.action !== action) {
        throw new Error('Incorrect or empty token action');
      }

      return jwtPayload;
    });
}

function generateToken(payload, secret) {
  var token = jwt.sign(payload, secret);
  return BPromise.resolve(token);
}
