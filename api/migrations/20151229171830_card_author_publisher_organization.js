'use strict';

var migrationUtils = require('../common/migration-utils');

exports.up = (knex, Promise) =>
  Promise.all([
    migrationUtils.replaceColumn(knex, Promise, 'card', 'author_id', (t, columnName) => {
      t.uuid(columnName).references('id').inTable('organization');
    }),
    migrationUtils.replaceColumn(knex, Promise, 'card', 'publisher_id', (t, columnName) => {
      t.uuid(columnName).references('id').inTable('organization');
    }),
    knex.schema.table('card', t => {
      t.dropColumns(['author_type', 'publisher_type']);
    })
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    migrationUtils.replaceColumn(knex, Promise, 'card', 'author_id', t => {
      t.uuid('author_id');
      t.string('author_type');
    }),
    migrationUtils.replaceColumn(knex, Promise, 'card', 'publisher_id', t => {
      t.uuid('publisher_id');
      t.string('publisher_type');
    })
  ])
  .then(() =>
    knex('card')
      .update({'author_type': 'organization', 'publisher_type': 'organization'})
  );
