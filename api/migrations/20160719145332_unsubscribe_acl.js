'use strict';

exports.up = knex =>
  knex('permission')
    .insert({name: 'unsubscribe_email_notifications', label: 'Unsubscribe Email Notifications'})
    .then(() =>
      knex('role_permission')
        .insert({role: 'anonymous', permission: 'unsubscribe_email_notifications'})
    );

exports.down = knex =>
  knex('role_permission')
    .where({role: 'anonymous', permission: 'unsubscribe_email_notifications'})
    .del()
    .then(() =>
      knex('permission')
        .where({name: 'unsubscribe_email_notifications'})
        .del()
    );
