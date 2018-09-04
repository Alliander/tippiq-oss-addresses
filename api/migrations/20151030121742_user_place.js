'use strict';

exports.up = knex =>
  knex.schema.createTable('user_place', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user').references('user.id');
    t.uuid('place').references('place.id');
  });

exports.down = knex =>
  knex.schema.dropTable('user_place');
