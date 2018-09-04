'use strict';

exports.up = knex =>
  knex('permission')
    .insert([
      {name: 'add_tag', label: 'Add Tag'},
      {name: 'update_tag', label: 'Update Tag'},
      {name: 'get_tag', label: 'Get Tag'},
      {name: 'delete_tag', label: 'Delete Tag'}
    ])
    .then(() =>
      knex('role_permission')
        .insert([
          {role: 'administrator', permission: 'add_tag'},
          {role: 'administrator', permission: 'update_tag'},
          {role: 'administrator', permission: 'get_tag'},
          {role: 'administrator', permission: 'delete_tag'}
        ])
    );

exports.down = (knex, Promise) =>
  Promise.all([
    knex('role_permission').where({role: 'administrator', permission: 'get_tag'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'update_tag'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'delete_tag'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'add_tag'}).del()
  ])
  .then(() =>
    Promise.all([
      knex('permission').where({name: 'get_tag'}).del(),
      knex('permission').where({name: 'update_tag'}).del(),
      knex('permission').where({name: 'delete_tag'}).del(),
      knex('permission').where({name: 'add_tag'}).del()
    ])
  );
