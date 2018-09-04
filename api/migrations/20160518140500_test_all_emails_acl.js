'use strict';

exports.up = knex =>
  knex('permission')
    .insert({
      name: 'test_all_emails',
      label: 'Test all e-mails'
    })
    .then(() =>
      knex('role_permission')
        .insert({
          role: 'authenticated',
          permission: 'test_all_emails'
        })
    );

exports.down = knex =>
  knex('role_permission')
    .where({
      role: 'authenticated',
      permission: 'test_all_emails'
    })
    .del()
    .then(() =>
      knex('permission')
        .where({
          name: 'test_all_emails'
        })
        .del()
    );
