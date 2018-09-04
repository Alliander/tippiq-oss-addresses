'use strict';

exports.up = knex =>
  knex('organization', t => {
    t.dropColumns(['email', 'phone', 'location', 'hide_location']);
  });

exports.down = knex =>
  knex('organization', t => {
    t.string('email');
    t.string('phone');
    t.uuid('location').references('location.id');
    t.boolean('hide_location');
  });
