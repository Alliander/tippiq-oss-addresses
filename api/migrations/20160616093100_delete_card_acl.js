'use strict';

exports.up = knex =>
  knex('role_permission')
    .insert({
      role: 'owner',
      permission: 'delete_card'
    });

exports.down = knex =>
  knex('role_permission')
    .where({
      role: 'owner',
      permission: 'delete_card'
    })
    .del();
