'use strict';

exports.up = knex =>
  knex.schema.createTable('user_organization_role', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user').nullable().references('user.id');
    t.uuid('organization').nullable().references('organization.id');
    t.uuid('role').nullable().references('role.id');
    t.dateTime('created_at').nullable();
    t.dateTime('updated_at').nullable();
  });

exports.down = knex =>
  knex.schema.dropTable('user_organization_role');
