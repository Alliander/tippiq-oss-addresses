'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('user', t => {
      t.integer('verification_notification_count').nullable();
    }),
    knex.schema.table('user', t => {
      t.dateTime('last_verification_notification_sent').nullable();
    })
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.table('user', t => {
      t.dropColumns(['verification_notification_count', 'last_verification_notification_sent']);
    })
  ]);
