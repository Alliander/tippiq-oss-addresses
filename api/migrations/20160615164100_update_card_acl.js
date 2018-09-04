'use strict';

exports.up = knex =>
  knex('role_permission')
    .insert({
      role: 'owner',
      permission: 'update_card'
    });

exports.down = knex =>
  knex('role_permission')
    .where({
      role: 'owner',
      permission: 'update_card'
    })
    .del();
