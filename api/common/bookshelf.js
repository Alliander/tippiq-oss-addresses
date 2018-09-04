'use strict';

var knex = require('knex');
var knexPostgis = require('knex-postgis');
var bookshelf = require('bookshelf');
var knexLog = require('debug')('tippiq:knex:queries');

var knexPostgisExtensions = require('./knex-postgis-extensions').knexPostgisExtensions;

var config = require('../../config');

var knexInstance = knex({
  client: 'pg',
  connection: config.pgConnectionString
});
knexInstance.st = knexPostgis(knexInstance);

knexInstance.postgisDefineExtras(knexPostgisExtensions);

knexInstance.on('query', function (query) {
  knexLog(query);
});

module.exports = bookshelf(knexInstance);
