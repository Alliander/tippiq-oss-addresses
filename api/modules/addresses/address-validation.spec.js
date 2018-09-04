'use strict';

const expect = require('chai').expect;
const AddressValidation = require('./address-validation');
const specUtils = require('../../test/spec-utils');
const ValidationError = require('../../common/errors/validation-error');
const BPromise = require('bluebird');

describe('AddressValidation', ()=> {
  describe('validateSearchQuery', () => {
    it('should split the query with search terms into an array', (done)=> {
      AddressValidation
        .validateSearchQuery({query: 'ab cd', max: 1})
        .then((result) => {
          expect(result.queryTerms).to.deep.equal(['ab', 'cd']);
          done();
        })
        .catch(specUtils.endHandler(done));
    });
    it('should create an array for a single term', (done)=> {
      AddressValidation
        .validateSearchQuery({query: 'ab', max: 1})
        .then((result) => {
          expect(result.queryTerms).to.deep.equal(['ab']);
          done();
        })
        .catch(specUtils.endHandler(done));
    });
    it('should require at least one term to be at least 2 characters in length', (done) => {
      BPromise
        .all([
          AddressValidation
            .validateSearchQuery({query: 'a c', max: 1})
            .then(
              ()=> {
                throw new Error('the promise should not resolve because of the invalid query');
              },
              (err) => {
                expect(err).to.be.instanceof(ValidationError);
              }),
          AddressValidation
            .validateSearchQuery({query: 'ab c', max: 1})
            .then((result) => {
              expect(result.queryTerms).to.deep.equal(['ab', 'c']);
            })
        ])
        .then(()=> {
          done();
        }, specUtils.endHandler(done));
    });

    it('should require that the query property is set on the input object', (done)=> {
      AddressValidation
        .validateSearchQuery({max: 1})
        .then(
          () => {
            done(new Error('the promise should not resolve because of the query is not set'));
          },
          (err) => {
            expect(err).to.be.instanceof(ValidationError);
            done();
          });
    });

    it('should return a default value when the max property is not set', (done) => {
      AddressValidation
        .validateSearchQuery({query: 'ab c'})
        .then(
          (result) => {
            expect(result.max).to.equal(8);
            done();
          },
          () => {
            done(new Error('the promise should not fail because it should return a default value'));
          });
    });

    it('should throw an error when a negative number is used', (done) => {
      AddressValidation
        .validateSearchQuery({query: 'ab c', max: '-1'})
        .then(
          ()=> {
            done(new Error('This is wrong'));
          },
          (err)=> {
            expect(err).to.be.instanceof(ValidationError);
            done();
          });
    });

    it('should throw an error when a too large number is used', (done) => {
      AddressValidation
        .validateSearchQuery({query: 'ab c', max: '10'})
        .then(
          ()=> {
            done(new Error('This is wrong'));
          },
          (err) => {
            expect(err).to.be.instanceof(ValidationError);
            done();
          });
    });
  });

  describe('validateFindByTypeQuery', () => {
    it('should be case-insensitive for type', (done) => {
      BPromise
        .all([
          AddressValidation
            .validateFindByTypeQuery({name: 'some-city', type: 'CITY'})
            .then((result) => {
              expect(result.type).to.equal('city');
            }),
          AddressValidation
            .validateFindByTypeQuery({name: 'some-city', type: 'City'})
            .then((result)=> {
              expect(result.type).to.equal('city');
            })
        ])
        .then(()=> {
          done();
        }, specUtils.endHandler(done));
    });

    it('should return correct type', (done) => {
      BPromise
        .all([
          AddressValidation
            .validateFindByTypeQuery({name: 'some-city', type: 'city'})
            .then((result) => {
              expect(result.type).to.equal('city');
            }),
          AddressValidation
            .validateFindByTypeQuery({name: 'some-municipality', type: 'municipality'})
            .then((result) => {
              expect(result.type).to.equal('municipality');
            })
        ])
        .then(() => {
          done();
        }, specUtils.endHandler(done));
    });

    it('should throw an error if type is not supplied', (done) => {
      AddressValidation
        .validateFindByTypeQuery({name: 'some-municipality', type: 'incorrect-type'})
        .then(() => {
            done(new Error('This is wrong'));
          },
          err => {
            expect(err).to.be.instanceof(ValidationError);
            done();
          });
    });


    it('should require that the name property is set on the input object', (done) => {
      AddressValidation
        .validateSearchQuery({type: 'city'})
        .then(() => {
            done(new Error('the promise should not resolve because of the query is not set'));
          },
          err => {
            expect(err).to.be.instanceof(ValidationError);
            done();
          });
    });

    it('should require that the name property contains at least 2 characters', (done) => {
      AddressValidation
        .validateSearchQuery({name: 'ab', type: 'city'})
        .then(() => {
            done(new Error('the promise should not resolve because of the query is not set'));
          },
          err => {
            expect(err).to.be.instanceof(ValidationError);
            done();
          });
    });
  });
});
