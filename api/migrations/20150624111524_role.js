'use strict';

exports.up = knex =>
  knex.schema.createTable('role', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name').nullable();
  });

exports.down = knex =>
  knex.schema.dropTable('role');
