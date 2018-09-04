'use strict';

exports.up = knex =>
  knex('permission')
    .insert({
      name: 'set_password_weekly_notification',
      label: 'Complete email verification for the weekly notification'
    })
    .then(() =>
      knex('role_permission')
        .insert({
          role: 'anonymous',
          permission: 'set_password_weekly_notification'
        })
    );

exports.down = knex =>
  knex('role_permission')
    .where({
      role: 'anonymous',
      permission: 'set_password_weekly_notification'
    })
    .del()
    .then(() =>
      Promise.all([
        knex('permission')
          .where({
            name: 'set_password_weekly_notification'
          })
          .del()
      ])
    );
