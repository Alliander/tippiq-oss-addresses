var config = require('./config');
var path = require('path');

const knexSettings = {
  client: 'pg',
  connection: config.pgConnectionString,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: path.resolve(__dirname, './api/migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, './api/seeds')
  }
};

module.exports = knexSettings;
