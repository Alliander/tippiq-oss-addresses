'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.table('location', t => {
      t.index([knex.raw('ST_transform(ST_SetSRID(geometry, 4326), 28992)')], 'location_geometry', 'gist');
    }),
    knex.schema.table('card_location', t => {
      t.index(['card', 'location']);
    }),
    knex.schema.table('card', t => {
      t.index(
        [
          knex.raw('coalesce("published_at",\'-infinity\')'),
          knex.raw('coalesce("expires_at",\'infinity\')')
        ],
        'card_published_at_expires_at'
      );
    }),
    knex.schema.raw('create view "user_service_max_distance" as ?', [
      knex
        .select([
          'user.id as user',
          'service.id as service',
          knex
            .raw(
              'coalesce("user_service_preference"."max_distance",' +
              'coalesce("service"."default_max_distance",\'infinity\')) ' +
              'as "max_distance"'
            ),
          knex.raw('coalesce("user_service_preference"."is_disabled",false) as "is_disabled"')
        ])
        .from('user')
        .crossJoin('service')
        .leftJoin('user_service_preference', function () {
          this
            .on('user_service_preference.service', 'service.id')
            .andOn('user_service_preference.user', 'user.id');
        })
    ])
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.raw('drop view "user_service_max_distance"'),
    knex.schema.table('location', t => {
      t.dropIndex(null, 'location_geometry');
    }),
    knex.schema.table('card_location', t => {
      t.dropIndex(['card', 'location']);
    }),
    knex.schema.table('card', t => {
      t.dropIndex(null, 'card_published_at_expires_at');
    })
  ]);
