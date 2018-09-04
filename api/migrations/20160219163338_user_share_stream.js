'use strict';

exports.up = knex =>
  knex.schema.table('user', t => {
    t.boolean('is_widget_enabled').notNullable().defaultTo(knex.raw('false'));
  });

exports.down = knex =>
  knex.schema.table('user', t => {
    t.dropColumn('is_widget_enabled');
  });
