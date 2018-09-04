'use strict';

exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('notification_template', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.text('name');
      t.text('description');
      t.dateTime('start_date');
      t.dateTime('end_date');
      t.text('subject');
      t.text('html_top');
      t.text('html_bottom');
      t.text('text_top');
      t.text('text_bottom');
    }),
    knex('permission')
      .insert([
        { name: 'add_notification_template', label: 'Add notification template' },
        { name: 'update_notification_template', label: 'Update notification template' },
        { name: 'delete_notification_template', label: 'Delete notification template' },
        { name: 'get_notification_templates', label: 'Get notification templates' },
        { name: 'get_notification_template', label: 'Get notification template' },
        { name: 'send_notification_preview', label: 'Send notification preview' }
      ])
  ])
  .then(() =>
    knex('role_permission')
      .insert([
        { role: 'administrator', permission: 'add_notification_template' },
        { role: 'administrator', permission: 'update_notification_template' },
        { role: 'administrator', permission: 'delete_notification_template' },
        { role: 'administrator', permission: 'get_notification_templates' },
        { role: 'administrator', permission: 'get_notification_template' },
        { role: 'administrator', permission: 'send_notification_preview' }
      ])
  );

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('notification_template'),
    knex('role_permission').where({role: 'administrator', permission: 'add_notification_template'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'update_notification_template'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'delete_notification_template'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'get_notification_templates'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'get_notification_template'}).del(),
    knex('role_permission').where({role: 'administrator', permission: 'send_notification_preview'}).del()
  ])
  .then(() =>
    Promise.all([
      knex('permission').where({name: 'add_notification_template'}).del(),
      knex('permission').where({name: 'update_notification_template'}).del(),
      knex('permission').where({name: 'delete_notification_template'}).del(),
      knex('permission').where({name: 'get_notification_templates'}).del(),
      knex('permission').where({name: 'get_notification_template'}).del(),
      knex('permission').where({name: 'send_notification_preview'}).del()
    ])
  );
