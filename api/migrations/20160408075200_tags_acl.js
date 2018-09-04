'use strict';

exports.up = knex =>
  knex('permission')
    .insert({name: 'get_tags', label: 'Get Tags'})
    .then(() =>
      knex('role_permission')
        .insert({role: 'administrator', permission: 'get_tags'})
    );

exports.down = knex =>
  knex('role_permission')
    .where({role: 'administrator', permission: 'get_tags'})
    .del()
    .then(() =>
      Promise.all([
        knex('permission')
          .where({name: 'get_tags'})
          .del()
      ])
    );
