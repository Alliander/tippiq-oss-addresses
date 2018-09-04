'use strict';

exports.up = knex =>
  knex.schema.createTable('place', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name').notNull();
    t.uuid('location').notNull().references('location.id');
  });

exports.down = knex =>
  knex.schema.dropTable('place');
