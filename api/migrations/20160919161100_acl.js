'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex('role_permission').where({role: 'anonymous', permission: 'complete_reset_password'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'migrate_users'}).del(),
    knex('role_permission').where({role: 'anonymous', permission:
      'set_password_weekly_notification'}).del()
  ])
    .then(() =>
      Promise.all([
        knex('permission').where({name: 'complete_reset_password'}).del(),
        knex('permission').where({name: 'migrate_users'}).del(),
        knex('permission').where({name: 'set_password_weekly_notification'}).del()
      ])
    );

exports.down = knex =>
  knex('permission').insert([
    {name: 'complete_reset_password', label: 'Complete Reset Password'},
    {name: 'migrate_users', label: 'Migrate Users'},
    {name: 'set_password_weekly_notification', label:
    'Complete email verification for the weekly notification'}
  ])
  .then(() =>
    knex('role_permission').insert([
      {role: 'anonymous', permission: 'complete_reset_password'},
      {role: 'administrator', permission: 'migrate_users'},
      {role: 'anonymous', permission: 'set_password_weekly_notification'}
    ])
  );
