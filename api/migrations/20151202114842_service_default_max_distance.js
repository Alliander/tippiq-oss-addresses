'use strict';

exports.up = knex =>
  knex.schema.table('service', t => {
    t.float('default_max_distance').nullable();
  });

exports.down = knex =>
  knex.schema.table('service', t => {
    t.dropColumns(['default_max_distance']);
  });
