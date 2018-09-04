'use strict';
var _ = require('lodash');

module.exports = _.defaults(
  {
    port: process.env.PORT,
    pgConnectionString: process.env.TIPPIQ_DATABASE_URL,
  },
  {
    port: 3000,
  });
