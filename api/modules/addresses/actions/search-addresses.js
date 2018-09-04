'use strict';

const debug = require('debug')('tippiq:addresses:actions:search');
const BPromise = require('bluebird');
const _ = require('lodash');

const AddressRepository = require('../address-repository');
const AddressValidation = require('../address-validation');

const ValidationError = require('./../../../common/errors/validation-error');
const routeUtils = require('./../../../common/route-utils');

exports.responseHandler = responseHandler;

function responseHandler(req, res) {
  AddressValidation.validateSearchQuery(req.query)
    .then((queryOptions) => {
      return BPromise
        .all([
          AddressRepository.searchCities(queryOptions),
          AddressRepository.searchZipcode4(queryOptions),
          AddressRepository.searchZipcode6(queryOptions),
          AddressRepository.searchStreets(queryOptions),
          AddressRepository.searchMunicipalities(queryOptions),
          AddressRepository.searchProvinces(queryOptions),
          AddressRepository.searchHouses(queryOptions),
          AddressRepository.matchHouses(queryOptions)
        ])
        .map((collection) => collection.serialize({ context: 'addresses_search' }))
        // eslint-disable-next-line max-params
        .spread((cities, zipcode4, zipcode6, streets, municipalities, provinces, houses, housesExact) => {
          return _
            .chain([cities, zipcode4, zipcode6, streets, municipalities, provinces, houses, housesExact])
            .flatten()
            .slice(0, queryOptions.max)
            .value();
        });
    })
    .then((serializedResults) => res.status(200).send(serializedResults))
    .catch(ValidationError, (e) => {
      routeUtils.sendError(res, 400, `Validation error: ${e.message}`);
    })
    .catch((e) => {
      debug(e);
      routeUtils.sendError(res, 500, 'Server error');
    });
}
