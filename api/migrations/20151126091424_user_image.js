'use strict';

exports.up = knex =>
  knex.schema.table('user', t => {
    t.dropColumns(['avatar_image']);
  })
  .then(() =>
    knex.schema.table('user', t => {
      t.uuid('avatar_image').nullable().references('image.id');
    })
  );

exports.down = knex =>
  knex.schema.table('user', t => {
    t.dropColumns(['avatar_image']);
  })
  .then(() =>
    knex.schema.table('user', t => {
      t.integer('avatar_image').nullable();
    })
  );
