'use strict';

exports.up = knex =>
  knex.schema.table('service', t => {
    t.string('short_description');
  });

exports.down = knex =>
  knex.schema.table('service', t => {
    t.dropColumn('short_description');
  });
