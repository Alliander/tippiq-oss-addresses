'use strict';

exports.up = knex =>
  knex.schema.table('place', t => {
    t.uuid('owner').nullable().references('user.id');
    t.uuid('main_occupant').nullable().references('user.id');
  });

exports.down = knex =>
  knex.schema.table('place', t => {
    t.dropColumn('main_occupant');
    t.dropColumn('owner');
  });
