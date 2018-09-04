'use strict';

exports.up = knex =>
  knex.schema.table('service', t => {
    t.renameColumn('owner', 'organization_id');
  });

exports.down = knex =>
  knex.schema.table('service', t => {
    t.renameColumn('organization_id', 'owner');
  });
