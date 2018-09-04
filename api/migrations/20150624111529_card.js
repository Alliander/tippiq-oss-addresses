/* eslint-disable max-statements */
'use strict';

exports.up = knex =>
  knex.schema.createTable('card', t => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('external_id').unique();
    t.uuid('parent_id').nullable().references('card.id');
    t.text('title');
    t.text('description');
    t.dateTime('start_date');
    t.dateTime('end_date');
    t.dateTime('published_at');
    t.dateTime('expires_at');
    t.string('author_type');
    t.uuid('author_id'); // TODO constraint to user and organization tables
    t.string('publisher_type');
    t.uuid('publisher_id'); // TODO constraint to user and organization tables
    t.uuid('owner').notNull();
    t.string('document_type');
    t.json('document');
    t.dateTime('created_at').notNull().defaultTo(knex.raw('now()'));
    t.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'));
    t.uuid('service').notNull().references('service.id');
  });

exports.down = knex =>
  knex.schema.dropTable('card');
