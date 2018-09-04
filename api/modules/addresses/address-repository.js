'use strict';

var CityAddress = require('./models/address-city-model');
var HouseAddress = require('./models/address-house-model');
var MunicipalityAddress = require('./models/address-municipality-model');
var ProvinceAddress = require('./models/address-province-model');
var StreetAddress = require('./models/address-street-model');
var Zipcode4Address = require('./models/address-zipcode4-model');
var Zipcode6Address = require('./models/address-zipcode6-model');
var CountryAddress = require('./models/address-country-model');
var StatusAddress = require('./models/address-status-model');
var knex = require('./../../common/bookshelf').knex;
var textsearchUtils = require('../../common/textsearch-utils');
var wordArrayToTsQuery = textsearchUtils.wordArrayToTsQuery;
var BPromise = require('bluebird');
var _ = require('lodash');

exports.CityAddress = CityAddress;
exports.HouseAddress = HouseAddress;
exports.MunicipalityAddress = MunicipalityAddress;
exports.ProvinceAddress = ProvinceAddress;
exports.StreetAddress = StreetAddress;
exports.Zipcode4Address = Zipcode4Address;
exports.Zipcode6Address = Zipcode6Address;
exports.CountryAddress = CountryAddress;
exports.findCity = findCity;
exports.findHouse = findHouse;
exports.findMunicipality = findMunicipality;
exports.findProvince = findProvince;
exports.findStreet = findStreet;
exports.findZipcode4 = findZipcode4;
exports.findZipcode6 = findZipcode6;
exports.findCountry = findCountry;
exports.getVersion = getVersion;

exports.searchCities = searchCities;
exports.searchZipcode4 = searchZipcode4;
exports.searchZipcode6 = searchZipcode6;
exports.searchStreets = searchStreets;
exports.searchMunicipalities = searchMunicipalities;
exports.searchProvinces = searchProvinces;
exports.searchHouses = searchHouses;
exports.matchHouses = matchHouses;

function getVersion() {
  return StatusAddress
    .where({})
    .orderBy('timestamp', 'DESC')
    .fetch();
}

function addressQueryDecoder(query) {
  return qb => {
    if (_.isFunction(query)) {
      query(qb);
    } else if (_.isObject(query)) {
      qb.where(query);
    }
  };
}

function findCity(query) {
  return CityAddress
    .query(addressQueryDecoder(query))
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function findHouse(where) {
  var suffix = where.suffix;
  delete where.suffix;

  var suffixSearch = function () {
    this.where('letter', suffix).orWhere('addition', suffix);
  };

  var query = HouseAddress.where(where);

  if (suffix) {
    query.where(suffixSearch);
  }

  return query.fetch({
    require: true
  });
}

function findMunicipality(query) {
  return MunicipalityAddress
    .query(addressQueryDecoder(query))
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function findProvince(where) {
  return ProvinceAddress
    .where(where)
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function findStreet(where) {
  return StreetAddress
    .where(where)
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function findZipcode4(where) {
  return Zipcode4Address
    .where(where)
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function findZipcode6(where) {
  return Zipcode6Address
    .where(where)
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function findCountry(where) {
  return CountryAddress
    .where(where)
    .fetch({
      columns: ['*', knex.st.dutchGeometryToGeoJSON('geometry').as('geojson')],
      require: true
    });
}

function searchCities(queryOptions) {
  return searchStringsByModel(queryOptions, CityAddress);
}

function searchStreets(queryOptions) {
  return searchStringsByModel(queryOptions, StreetAddress);
}

function searchMunicipalities(queryOptions) {
  return searchStringsByModel(queryOptions, MunicipalityAddress);
}

function searchProvinces(queryOptions) {
  return searchStringsByModel(queryOptions, ProvinceAddress);
}

function searchZipcode4(queryOptions) {
  return searchStringsByModel(queryOptions, Zipcode4Address);
}

function searchZipcode6(queryOptions) {
  return textsearchUtils
    .decodePartialZipcodes(queryOptions.queryTerms)
    .then(function (zipcodeParts) {
      if (!zipcodeParts.length) {
        // When there are no zipcodes in the queryTerms short circuit the query
        return Zipcode6Address.collection();
      }
      return Zipcode6Address
        .query(function (qb) {
          qb.column([
            '*',
            knex.st.dutchGeometryToGeoJSON('geometry').as('geometry')
          ]);
          zipcodeParts.forEach(function (zipcodePart) {
            var letters = zipcodePart.letters;
            var lettersOperator = '=';

            if (letters.length < 2) {
              letters = letters + '_';
              lettersOperator = 'LIKE';
            }
            qb.orWhere(function () {
              this
                .where('zipcode_digits', zipcodePart.digits)
                .andWhere('zipcode_letters', lettersOperator, letters);
            });
            qb.limit(queryOptions.max);
          });
        })
        .fetchAll();
    });
}

function searchHouses(queryOptions) {
  var hasNumericTerm = _.filter(queryOptions.queryTerms, /[0-9]/).length > 0;
  var hasAlphabeticTerm = _.filter(queryOptions.queryTerms, /[a-zA-Z]/).length > 0;
  var hasMoreThanOneTerm = queryOptions.queryTerms.length > 1;

  if (!(hasNumericTerm && hasAlphabeticTerm && hasMoreThanOneTerm)) {
    // Only search for houses when there are at least 2 terms of which at least 1 is Numeric and 1 is Alphabetic.
    return HouseAddress.collection();
  }
  return searchStringsByModel(queryOptions, HouseAddress);
}

function parseStreet(address) {
  // split by last numeral (this will break if addition is numeral, but better than nothing)
  const streetParts = address.split(/(\d+)(?!.*\d)/);

  return {
    'street_name': streetParts.length > 0 ? streetParts[0].trim() : null,
    'nr': streetParts.length > 1 ? streetParts[1].trim() : null,
    'addition': streetParts.length > 2 ? streetParts[2].trim() : null
  };
}

function matchHouses(queryOptions) {
  const myQuery = decodeURIComponent(queryOptions.queryTerms.join(' '));

  if (myQuery.indexOf(',') < 0) {
    return { serialize: () => [] };
  }
  const address = myQuery.split(',');
  const streetAddress = parseStreet(address.length > 0 ? address[0] : '');
  const zipCode = address.length > 1 ? address[1].trim().split(' ') : null;
  const city = address.length > 2 ? address[2].trim() : '';

  const where = _(_.assign({
    'zipcode_digits': (zipCode.length > 0 ? zipCode[0] : null),
    'zipcode_letters': (zipCode.length > 1 ? zipCode[1] : null),
    'city_name': city
  }, streetAddress)).omit(_.isNull).value();

  const letterOrAddition = where.addition;
  delete where.addition;

  return HouseAddress
    .query(function (qb) {
      qb.column([
        '*',
        knex.st.dutchGeometryToGeoJSON('geometry').as('geometry')
      ]);
      qb.where(where);

      qb.where(function () {
        this
          .where('addition', letterOrAddition)
          .orWhere('letter', letterOrAddition);
      });

      qb.limit(queryOptions.max);
    })
    .fetchAll()
    .timeout(1000)
    .catch(() => ({ serialize: () => [] }));
}

/**
 *
 * @param {object} queryOptions Array of search terms that will be searched for
 * @param {object} addressModel Reference to Bookshelf model to search in
 * @returns {*|Promise.<Collection>} of addresses
 */
function searchStringsByModel(queryOptions, addressModel) {
  return addressModel
    .query(function (qb) {
      qb.joinRaw(knex.raw(',to_tsquery(?)', [wordArrayToTsQuery(queryOptions.queryTerms)]).as('query'));
      qb.column([
        '*',
        knex.st.dutchGeometryToGeoJSON('geometry').as('geometry'),
        // http://www.postgresql.org/docs/9.1/static/textsearch-controls.html#TEXTSEARCH-RANKING
        // Normalization is set to 0 since document length is not a factor for this query.
        // Weight is measured on a scale of A,B,C,D.
        knex.raw('ts_rank_cd(suggest_vector, query, 0)', []).as('rank')
      ]);
      qb.whereRaw('suggest_vector @@ query');
      qb.limit(queryOptions.max);
    })
    .orderBy('rank', 'desc')
    .fetchAll()
    .timeout(1000)
    .catch(BPromise.TimeoutError, function () {
      return {
        serialize: function () {
          return [];
        }
      };
    });
}
