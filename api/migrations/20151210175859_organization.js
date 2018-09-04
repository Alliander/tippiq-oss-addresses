'use strict';

exports.up = knex =>
  knex.schema.table('organization', t => {
    t.string('website');
  });

exports.down = knex =>
  knex.schema.table('organization', t => {
    t.dropColumns(['website']);
  });
