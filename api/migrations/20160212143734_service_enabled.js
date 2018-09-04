'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.raw('drop view "user_service_max_distance"'),
    knex.schema.table('service', t => {
      t.boolean('is_enabled').notNullable().defaultTo(true);
    }),
    knex.schema.table('user_service_preference', t => {
      t.renameColumn('is_disabled', 'is_enabled');
    }),
    knex.schema.raw('update "user_service_preference" set "is_enabled" =  not "is_enabled"'),
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
          knex.raw('coalesce("user_service_preference"."is_enabled", true) and "service"."is_enabled" as "is_enabled"')
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
    knex.schema.table('service', t => {
      t.dropColumns(['is_enabled']);
    }),
    knex.schema.raw('update "user_service_preference" set "is_enabled" =  not "is_enabled"'),
    knex.schema.table('user_service_preference', t => {
      t.renameColumn('is_enabled', 'is_disabled');
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
