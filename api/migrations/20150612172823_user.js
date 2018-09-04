'use strict';

exports.up = knex =>
  knex.schema.createTable('user', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('name').nullable();
    t.string('email').notNull();
    t.string('password_hash').notNull();
    t.boolean('is_pioneer').nullable();
    t.integer('avatar_image').nullable();
    t.boolean('email_notifications_enabled').notNull();
    t.boolean('email_is_verified').defaultTo(false).notNull();
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    t.boolean('is_password_migrated_to_vthree').defaultTo(true);
  });

exports.down = knex =>
  knex.schema.dropTable('user');
