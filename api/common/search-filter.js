'use strict';

var utils = require('./utils');

var constants = Object.freeze({
  TYPES: Object.freeze({
    EXACT_MATCH: 'types.exact_match',
    SEARCH: 'types.search',
    DATE: 'types.date'
  })
});

exports.constants = constants;
exports.SearchFilter = SearchFilter;

function SearchFilter(columnName, value, type) {
  this.value = value;
  this.columnName = columnName;
  this.type = utils.defaultIfUndefined(type, constants.TYPES.EXACT_MATCH);
}

SearchFilter.prototype.createQueryProperties = function (columnName, input, type) {
  switch (type) {
    case constants.TYPES.EXACT_MATCH:
      return [equalFilter(columnName, input)];

    case constants.TYPES.SEARCH:
      return [searchFilter(columnName, input)];

    case constants.TYPES.DATE:
      return dateFilters(columnName, input);

    default:
      return [];
  }
};

SearchFilter.prototype.getQueryProperties = function () {
  return this.createQueryProperties(this.columnName, this.value, this.type);
};

function equalFilter(columnName, input) {
  if (typeof input === 'undefined') {
    return null;
  }

  return {
    column: columnName,
    operator: '=',
    value: input
  };
}

function searchFilter(columnName, input) {
  if (typeof input === 'undefined') {
    return null;
  }

  return {
    column: columnName,
    operator: 'ILIKE',
    value: `%${input}%`
  };
}

function dateFilters(columnName, input) {
  var filters = [];

  if (typeof input === 'undefined') {
    return [];
  }

  var dates = input.split('...');

  if (dates[0]) {
    filters.push({
      column: columnName,
      operator: '>=',
      value: dates[0]
    });
  }

  if (dates[1]) {
    filters.push({
      column: columnName,
      operator: '<=',
      value: dates[1]
    });
  }

  return filters;
}
