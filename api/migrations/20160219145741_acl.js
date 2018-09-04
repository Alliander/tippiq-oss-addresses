'use strict';

exports.up = knex =>
  knex.schema.createTableIfNotExists('permission', t => {
    t.string('name').primary();
    t.string('label');
  })
  .then(() =>
    knex('permission')
      .insert([
        {name: 'add_card', label: 'Add Card'},
        {name: 'add_organization', label: 'Add Organization'},
        {name: 'add_place', label: 'Add Place'},
        {name: 'add_role', label: 'Add Role'},
        {name: 'add_role_permission', label: 'Add Role Permission'},
        {name: 'add_service', label: 'Add Service'},
        {name: 'add_user_role', label: 'Add User Role'},
        {name: 'add_user_service_preference', label: 'Add User Service Preference'},
        {name: 'audio_captcha', label: 'Audio Captcha'},
        {name: 'check_email', label: 'Check Email'},
        {name: 'complete_email_verification', label: 'Complete Email Verification'},
        {name: 'complete_reset_password', label: 'Complete Reset Password'},
        {name: 'delete_card', label: 'Delete Card'},
        {name: 'delete_organization', label: 'Delete Organization'},
        {name: 'delete_place', label: 'Delete Place'},
        {name: 'delete_role', label: 'Delete Role'},
        {name: 'delete_role_permission', label: 'Delete Role Permission'},
        {name: 'delete_service', label: 'Delete Service'},
        {name: 'delete_user', label: 'Delete User'},
        {name: 'delete_user_role', label: 'Delete User Role'},
        {name: 'delete_user_service_preference', label: 'Delete User Service Preference'},
        {name: 'get_api', label: 'Get API'},
        {name: 'get_card', label: 'Get Card'},
        {name: 'get_cards', label: 'Get Cards'},
        {name: 'get_organization', label: 'Get Organization'},
        {name: 'get_organizations', label: 'Get Organizations'},
        {name: 'get_organizations_partners', label: 'Get Organizations Partners'},
        {name: 'get_place', label: 'Get Place'},
        {name: 'get_places', label: 'Get Places'},
        {name: 'get_role', label: 'Get Role'},
        {name: 'get_role_permission', label: 'Get Role Permission'},
        {name: 'get_role_permissions', label: 'Get Role Permissions'},
        {name: 'get_roles', label: 'Get Roles'},
        {name: 'get_service', label: 'Get Service'},
        {name: 'get_services', label: 'Get Services'},
        {name: 'get_user_profile', label: 'Get User Profile'},
        {name: 'get_user_role', label: 'Get User Role'},
        {name: 'get_user_roles', label: 'Get User Roles'},
        {name: 'get_user_service_preference', label: 'Get User Service Preference'},
        {name: 'get_user_service_preferences', label: 'Get User Service Preferences'},
        {name: 'image_captcha', label: 'Image Captcha'},
        {name: 'login', label: 'Login'},
        {name: 'migrate_users', label: 'Migrate Users'},
        {name: 'open_single_card_page_redirect', label: 'Open Single Card Page Redirect'},
        {name: 'refresh_token', label: 'Refresh Token'},
        {name: 'register_user', label: 'Register User'},
        {name: 'search_addresses', label: 'Search Addresses'},
        {name: 'search_card', label: 'Search Card'},
        {name: 'send_contact', label: 'Send Contact'},
        {name: 'send_users_email', label: 'Send Users Email'},
        {name: 'start_captcha', label: 'Start Captcha'},
        {name: 'start_email_verification', label: 'Start Email Verification'},
        {name: 'start_reset_password', label: 'Start Reset Password'},
        {name: 'update_card', label: 'Update Card'},
        {name: 'update_organization', label: 'Update Organization'},
        {name: 'update_place', label: 'Update Place'},
        {name: 'update_role', label: 'Update Role'},
        {name: 'update_role_permission', label: 'Update Role Permission'},
        {name: 'update_service', label: 'Update Service'},
        {name: 'update_user_profile_email_address', label: 'Update User Profile Email Address'},
        {
          name: 'update_user_profile_email_notifications_enabled',
          label: 'Update User Profile Email Notifications Enabled'
        },
        {name: 'update_user_profile_name', label: 'Update User Profile Name'},
        {name: 'update_user_profile_password', label: 'Update User Profile Password'},
        {name: 'update_user_role', label: 'Update User Role'},
        {name: 'update_user_service_preference', label: 'Update User Service Preference'},
        {name: 'widget_token', label: 'Widget Token'}
      ])
  )
  .then(() =>
    knex.schema.table('user_role', t => {
      t.dropColumns(['role']);
    })
  )
  .then(() =>
    knex.schema.dropTable('user_organization_role')
  )
  .then(() =>
    knex.schema.table('role', t => {
      t.dropColumns(['id']);
      t.renameColumn('name', 'label');
    })
  )
  .then(() =>
    knex.schema.table('role', t => t.string('name').primary())
  )
  .then(() =>
    knex('role')
      .insert([
        {name: 'administrator', label: 'Administrator'},
        {name: 'cards_administrator', label: 'Cards Administrator'},
        {name: 'anonymous', label: 'Anonymous'},
        {name: 'authenticated', label: 'Authenticated'},
        {name: 'owner', label: 'Owner'}
      ])
  )
  .then(() =>
    knex.schema.createTableIfNotExists('role_permission', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.string('role').notNull().references('role.name');
      t.string('permission').notNull().references('permission.name');
    })
  )
  .then(() =>
    knex('role_permission')
      .insert([
        {role: 'owner', permission: 'update_place'},
        {role: 'owner', permission: 'get_place'},
        {role: 'owner', permission: 'delete_user'},
        {role: 'authenticated', permission: 'update_user_profile_name'},
        {role: 'authenticated', permission: 'start_email_verification'},
        {role: 'authenticated', permission: 'delete_user_service_preference'},
        {role: 'authenticated', permission: 'get_user_service_preferences'},
        {role: 'authenticated', permission: 'refresh_token'},
        {role: 'authenticated', permission: 'get_user_profile'},
        {role: 'authenticated', permission: 'update_user_profile_email_notifications_enabled'},
        {role: 'authenticated', permission: 'add_user_service_preference'},
        {role: 'authenticated', permission: 'update_user_profile_password'},
        {role: 'authenticated', permission: 'update_user_service_preference'},
        {role: 'authenticated', permission: 'get_services'},
        {role: 'authenticated', permission: 'get_user_service_preference'},
        {role: 'authenticated', permission: 'update_user_profile_email_address'},
        {role: 'authenticated', permission: 'widget_token'},
        {role: 'cards_administrator', permission: 'add_card'},
        {role: 'cards_administrator', permission: 'update_card'},
        {role: 'cards_administrator', permission: 'delete_card'},
        {role: 'administrator', permission: 'add_card'},
        {role: 'administrator', permission: 'update_card'},
        {role: 'administrator', permission: 'delete_card'},
        {role: 'administrator', permission: 'send_users_email'},
        {role: 'administrator', permission: 'migrate_users'},
        {role: 'administrator', permission: 'delete_user'},
        {role: 'administrator', permission: 'get_organizations'},
        {role: 'administrator', permission: 'add_organization'},
        {role: 'administrator', permission: 'get_organization'},
        {role: 'administrator', permission: 'update_organization'},
        {role: 'administrator', permission: 'delete_organization'},
        {role: 'administrator', permission: 'get_places'},
        {role: 'administrator', permission: 'add_place'},
        {role: 'administrator', permission: 'get_place'},
        {role: 'administrator', permission: 'update_place'},
        {role: 'administrator', permission: 'delete_place'},
        {role: 'administrator', permission: 'add_service'},
        {role: 'administrator', permission: 'get_service'},
        {role: 'administrator', permission: 'update_service'},
        {role: 'administrator', permission: 'delete_service'},
        {role: 'administrator', permission: 'get_roles'},
        {role: 'administrator', permission: 'add_role'},
        {role: 'administrator', permission: 'get_role'},
        {role: 'administrator', permission: 'update_role'},
        {role: 'administrator', permission: 'delete_role'},
        {role: 'administrator', permission: 'get_role_permissions'},
        {role: 'administrator', permission: 'add_role_permission'},
        {role: 'administrator', permission: 'get_role_permission'},
        {role: 'administrator', permission: 'update_role_permission'},
        {role: 'administrator', permission: 'delete_role_permission'},
        {role: 'administrator', permission: 'get_user_roles'},
        {role: 'administrator', permission: 'add_user_role'},
        {role: 'administrator', permission: 'get_user_role'},
        {role: 'administrator', permission: 'update_user_role'},
        {role: 'administrator', permission: 'delete_user_role'},
        {role: 'anonymous', permission: 'get_card'},
        {role: 'anonymous', permission: 'search_addresses'},
        {role: 'anonymous', permission: 'get_cards'},
        {role: 'anonymous', permission: 'get_api'},
        {role: 'anonymous', permission: 'search_card'},
        {role: 'anonymous', permission: 'send_contact'},
        {role: 'anonymous', permission: 'login'},
        {role: 'anonymous', permission: 'check_email'},
        {role: 'anonymous', permission: 'complete_email_verification'},
        {role: 'anonymous', permission: 'register_user'},
        {role: 'anonymous', permission: 'start_reset_password'},
        {role: 'anonymous', permission: 'complete_reset_password'},
        {role: 'anonymous', permission: 'get_organizations_partners'},
        {role: 'anonymous', permission: 'open_single_card_page_redirect'},
        {role: 'anonymous', permission: 'start_captcha'},
        {role: 'anonymous', permission: 'audio_captcha'},
        {role: 'anonymous', permission: 'image_captcha'}
      ])
  )
  .then(() =>
    knex.schema.table('user_role', t => {
      t.string('role').references('role.name');
    })
  );

exports.down = knex =>
  knex.schema.table('user_role', t => {
    t.dropColumns(['role']);
  })
  .then(() =>
    knex.schema.dropTable('role_permission')
  )
  .then(() =>
    knex.schema.dropTable('permission')
  )
  .then(() =>
    knex.schema.table('role', t => t.dropColumns(['name']))
  )
  .then(() =>
    knex.schema.table('role', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.renameColumn('label', 'name');
    })
  )
  .then(() =>
    knex.schema.table('user_role', t => t.uuid('role').references('role.id'))
  )
  .then(() =>
    knex.schema.createTable('user_organization_role', t => {
      t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('user').nullable().references('user.id');
      t.uuid('organization').nullable().references('organization.id');
      t.uuid('role').nullable().references('role.id');
      t.dateTime('created_at').nullable();
      t.dateTime('updated_at').nullable();
    })
  );
