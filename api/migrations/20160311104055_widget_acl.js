'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex('role')
      .insert({name: 'widget', label: 'Widget'}),
    knex('permission')
      .insert({name: 'view_widget_card_stream', label: 'Widget Cards'})
  ])
  .then(() =>
    knex('role_permission')
      .insert({role: 'widget', permission: 'view_widget_card_stream'})
  );

exports.down = (knex, Promise) =>
  knex('role_permission')
    .where({role: 'widget', permission: 'view_widget_card_stream'})
    .del()
    .then(() =>
      Promise.all([
        knex('permission').where({name: 'view_widget_card_stream'}).del(),
        knex('role').where({name: 'widget'}).del()
      ])
    );
