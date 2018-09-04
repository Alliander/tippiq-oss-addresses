'use strict';

const debug = require('debug')('tippiq:addresses:actions:lookup');

const AddressRepository = require('../address-repository');
const AddressValidation = require('../address-validation');
const CityAddress = require('../models/address-city-model');
const MunicipalityAddress = require('../models/address-municipality-model');

const ValidationError = require('./../../../common/errors/validation-error');
const routeUtils = require('./../../../common/route-utils');

exports.responseHandler = responseHandler;

function responseHandler(req, res) {
  AddressValidation.validateFindByTypeQuery(req.query)
    .then((queryOptions) => {
      switch (queryOptions.type) {
        case 'city':
          return AddressRepository.findCity(qb => {
            qb.where('city_name', 'ilike', queryOptions.name);
          });
        case 'municipality':
          return AddressRepository.findMunicipality(qb => {
            qb.where('municipality_name', 'ilike', queryOptions.name);
          });
        default:
          throw new Error('Validation error: type is not supported');
      }
    })
    .then(addressModel => {
      res.json({
        location: addressModel.serialize({ context: 'addresses_find_by_location' })
      });
    })
    .catch(CityAddress.NotFoundError, () => {
      routeUtils.sendError(res, 404, 'Not Found');
    })
    .catch(MunicipalityAddress.NotFoundError, () => {
      routeUtils.sendError(res, 404, 'Not Found');
    })
    .catch(ValidationError, (e) => {
      routeUtils.sendError(res, 400, `Validation error: ${e.message}`);
    })
    .catch((e) => {
      debug(e);
      routeUtils.sendError(res, 500, 'Server error');
    });
}
