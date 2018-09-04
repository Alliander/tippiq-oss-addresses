'use strict';

exports.up = knex =>
  knex.schema.table('location', t => {
    t.dropIndex(null, 'location_geometry');
    t.index(['geometry'], 'location_geometry', 'gist');
  });

exports.down = knex =>
  knex.schema.table('location', t => {
    t.dropIndex(null, 'location_geometry');
    t.index([knex.raw('ST_transform(ST_SetSRID(geometry, 4326), 28992)')], 'location_geometry', 'gist');
  });
