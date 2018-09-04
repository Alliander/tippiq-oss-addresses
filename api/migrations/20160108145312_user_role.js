'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('user_role', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('user').notNull().references('user.id');
      t.uuid('role').notNull().references('role.id');
      t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
      t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    }),
    knex.schema.raw('ALTER TABLE "card" ' +
      'ADD CONSTRAINT "card_owner_foreign" ' +
      'FOREIGN KEY (owner) ' +
      'REFERENCES "user" (id)')
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('user_role'),
    knex.schema.raw('ALTER TABLE "card" DROP CONSTRAINT "card_owner_foreign"')
  ]);
