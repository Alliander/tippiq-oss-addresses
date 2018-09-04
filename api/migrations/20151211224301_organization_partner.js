'use strict';

exports.up = knex =>
  knex.schema.table('organization', t => {
    t.boolean('is_partner').notNull().defaultTo(true);
    t.float('partner_level').nullable();
  });

exports.down = knex =>
  knex.schema.table('organization', t => {
    t.dropColumns(['partner_level', 'is_partner']);
  });
