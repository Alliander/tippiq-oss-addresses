'use strict';

exports.up = knex =>
  knex.schema.createTable('service', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name').notNull();
    t.string('category').notNull();
    t.uuid('owner').notNull().references('organization.id');
    t.text('description', 'longtext');
    t.string('url', 255);
  });

exports.down = knex =>
  knex.schema.dropTable('service');
