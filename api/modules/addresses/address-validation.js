'use strict';

var BPromise = require('bluebird');
var ValidationError = require('../../common/errors/validation-error');

exports.validateSearchQuery = validateSearchQuery;
exports.validateFindByTypeQuery = validateFindByTypeQuery;

/**
 * Validate the query parameters for the addresses search.
 * @param {object} queryParameters Object containing the query parameters for the request, the values of the properties 'q'
 *  and 'max' are validated and returned.
 * @returns {*} Object containing properties q and max
 */
function validateSearchQuery(queryParameters) {
  return BPromise
    .all([
      BPromise.resolve(queryParameters.query).then(validateSearchTerms),
      BPromise.resolve(queryParameters.max).then(validateMaxResults)
    ])
    .spread(function (termsArray, maxResults) {
      return {
        queryTerms: termsArray,
        max: maxResults
      };
    });
}

/**
 * Validate the query parameters for the addresses search on location type.
 * @param {object} queryParameters Object containing the query parameters for the request, the values of the properties 'name'
 *  and 'type' are validated and returned.
 * @returns {*} Object containing properties name and type
 */
function validateFindByTypeQuery(queryParameters) {
  return BPromise
    .all([
      BPromise.resolve(queryParameters.name).then(validateName),
      BPromise.resolve(queryParameters.type).then(validateType)
    ])
    .spread(function (name, type) {
      return {
        name: name,
        type: type
      };
    });
}

function validateSearchTerms(terms) {
  if (!terms) {
    throw new ValidationError('The query should contain at least one term with a length of minimum 2 characters.');
  }
  terms = terms || '';
  var termsArray = terms
    .trim()
    .split(/\s+/);
  var longestTerm = termsArray.reduce(function (a, b) {
    return a.length > b.length ? a : b;
  });
  if (longestTerm.length < 2) {
    throw new ValidationError('The query should contain at least one term with a length of minimum 2 characters.');
  }

  return termsArray;
}

function validateMaxResults(maxResults) {
  maxResults = parseInt(maxResults, 10);
  if (isNaN(maxResults)) {
    return 8;
  }
  if (maxResults < 1 || maxResults > 8) {
    throw new ValidationError('The value ov max should be between 1 and 8');
  }
  return maxResults;
}

function validateName(term) {
  if (!term) {
    throw new ValidationError('The query should contain at least one term with a length of minimum 2 characters.');
  }
  if (term.length < 2) {
    throw new ValidationError('The query should contain at least one term with a length of minimum 2 characters.');
  }
  return term;
}

function validateType(type) {
  type = type.toLowerCase();
  switch (type) {
    case 'city':
    case 'municipality':
      return type;
    default:
      throw new ValidationError('Type is not supported');
  }
}
