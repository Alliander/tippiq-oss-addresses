exports.up = (knex, Promise) => Promise.all([
  // knex.schema.dropTable('location'),
  knex.schema.raw('drop view user_service_max_distance'),
  knex.schema.dropTable('card_tag'),
  knex.schema.dropTable('object_image'),
  knex.schema.dropTable('card_location'),
  knex.schema.dropTable('user_place'),
  knex.schema.dropTable('service_tag_whitelist'),
  knex.schema.dropTable('notification_template'),
  knex.schema.dropTable('user_service_preference'),
  knex.schema.dropTable('user_role'),
  knex.schema.dropTable('role_permission'),
  knex.schema.dropTable('role'),
  knex.schema.dropTable('permission'),
  knex.schema.dropTable('place'),
  knex.schema.dropTable('card'),
  knex.schema.dropTable('service'),
  knex.schema.dropTable('organization'),
  knex.schema.dropTable('user'),
  knex.schema.dropTable('image'),
  knex.schema.dropTable('tag')
]);

exports.down =  (knex, Promise) => Promise.resolve();
