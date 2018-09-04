'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex('permission')
      .insert([
        {name: 'get_service_id', label: 'Get id of a service'},
        {name: 'get_organization_id', label: 'Get id of an organization'},
        {name: 'get_partner_info', label: 'Get info of a partner'}
      ]),
    knex('role').insert({name: 'cms', label: 'CMS user'})
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex('permission')
      .where({
        name: 'get_service_id'
      })
      .orWhere({
        name: 'get_organization_id'
      })
      .orWhere({
        name: 'get_partner_info'
      })
      .del(),
    knex('role')
      .where({
        name: 'cms'
      })
      .del()
  ]);
