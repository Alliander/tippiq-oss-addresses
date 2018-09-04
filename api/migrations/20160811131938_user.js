'use strict';

exports.up = knex =>
  knex.schema.table('user', t => {
    t.dropColumn('password_hash');
    t.dropColumn('is_password_migrated_to_vthree');
    t.dropColumn('email');
    t.dropColumn('email_is_verified');
  });

exports.down = knex =>
  knex.schema.table('user', t => {
    t.string('password_hash');
    t.boolean('is_password_migrated_to_vthree').defaultTo(true);
    t.string('email');
    t.boolean('email_is_verified').defaultTo(false).notNull();
  });
