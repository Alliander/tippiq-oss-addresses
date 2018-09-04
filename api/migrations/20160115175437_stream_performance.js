'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex.table('service').update({'default_max_distance': 0}).whereNull('default_max_distance'),
    knex.schema.raw('alter table service alter column default_max_distance set not null'),
    knex.table('card').update({'published_at': 'now'}).whereNull('published_at'),
    knex.schema.raw('alter table card alter column published_at set not null')
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.raw('alter table service alter column default_max_distance drop not null'),
    knex.schema.raw('alter table card alter column published_at drop not null')
  ]);
