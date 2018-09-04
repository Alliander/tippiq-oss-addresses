# Tippiq Addresses OSS

*Update 03-09-2017*: This repository is now published as open source software under the GPL 3 License (see the LICENSE file).

*Warning*: Please take the appropriate security measures before running this software in production.


Tippiq Developer Docs
=====================

#### Prerequisites

* [Node.js](https://nodejs.org/)
* [Git](http://git-scm.com/)
* [Ruby](https://www.ruby-lang.org/en/)
* [Postgres](http://www.postgresql.org/)
* [Bundler](http://bundler.io/)

Make sure to install Ruby 2.0.0.

## Environment setup
#### 1. Create an empty database

    $ psql -d postgres

    CREATE ROLE tippiq LOGIN
      UNENCRYPTED PASSWORD 'tippiq'
      SUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
    CREATE DATABASE tippiq
      WITH OWNER = tippiq
           ENCODING = 'UTF8'
           TABLESPACE = pg_default
           LC_COLLATE = 'C'
           LC_CTYPE = 'UTF-8'
           CONNECTION LIMIT = -1
           TEMPLATE template0;

#### 2. Set required environment variables
Only DATABASE_URL is required

    $ export DATABASE_URL=postgres://tippiq:tippiq@localhost:5432/tippiq
    $ export NEW_RELIC_LICENSE_KEY=<license-key>
    $ export PASSPORT_JWT_SECRET=<secret-string-for-passport-jwt>

    > Note: add these export lines to your `.bashrc` to make this setting permanent on your system.

#### 3. Install Gulp, Bower, Mocha, Forever, Istanbul and Knex

    $ npm install -g gulp bower mocha forever istanbul knex

#### 4. Install project dependencies
Run the commands below in the project root directory.
Make sure Postgres is running before executing npm install (it migrates and seeds the database).

    $ bundle install
    $ nvm install (if you use nvm, this will set and install the correct Node version)
    $ npm install

#### 5. Install and run the address importer
See tools/address-importer/README.md for further details.

#### 6. Install mailcatcher

    $ gem install mailcatcher

#### 7. Run mailcatcher

    $ mailcatcher

#### 8. Update the webdriver manager

    $ npm run webdriver-manager-update

#### Use knex CLI to apply migrations and/or import seed data
npm install already migrates and seeds the database.


    $ knex migrate:rollback
    $ knex migrate:latest
    $ knex seed:run

    > Note: see http://knexjs.org/#Migrations-CLI for more information about Knex migrations.

## Docker

### Publish new version to Docker Hub

  $ docker build -t tippiq/tippiq:latest .
  $ docker push tippiq/tippiq:latest

## Usage

#### $ npm start
Use this command during development.

1. Starts the API

    > Note: use the `DEBUG` variable before `npm start` to show debug info in the console.

    > Examples:
    > `DEBUG=tippiq:* npm start` to see all logs of the api
    > `DEBUG=tippiq:knex:queries npm start` to see all queries that are run by knex

    > Or, use `npm run dev` for reloading the API on API file changes.
    Uses nodemon for watching and reloading, also logs to the console.

2. The web server also serves the `webapp` and `.tmp` directory

    > Note: add `?mockbackend=true/false` to the URL to toggle mocking the API

#### $ gulp test:unit
Runs the unit-tests for the frontend backend.

To run single test suites or tests:
`fdescribe` or `fit` instead of `describe` or `it('should...`

#### $ gulp test:e2e:local
Runs the E2E-tests for the frontend with the local configuration.

#### $ npm run test:api
Runs the unit-tests and E2E-tests for the API backend.

To run single tests suites or tests:
`describe.only` or `it.only`

#### $ gulp docs
Generate API documentation.

#### $ npm run visualcaptcha
Generate and new audio files in `tools/visualcaptcha-nl-audios` and copy them to `api/modules/visual-captcha`.
These files are checked in because the `say`
command is OSX specific.

Prerequisites:

* Apple OSX [`say`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/say.1.html)
* [SOX](http://sox.sourceforge.net/) `brew install sox --with-lame --with-libvorbis`
* `npm install` in `tools/visualcaptcha-nl-audios`

## Deploying to production
We use Wercker for CI and Heroku for the production environment.

When a build in Wercker is successful, you can choose to deploy it to an environment of Heroku.

The configuration can be found in the `Procfile` and `wercker.yml`.
Heroku will run `$ npm install` and then execute the web command in the `Procfile`.

The port to use is automatically defined by Heroku as the environment variable `PORT`.

Heroku configuration variables:

* BUILDPACK_URL: `FILL_IN`
* NPM_CONFIG_PRODUCTION: `false` (to make sure both `dependencies` and `devDependencies` are installed)
* DATABASE_URL: `postgres://<username>:<password>@<host>:<port>/<database>?sslca=<path-to-certificate>`
* NEW_RELIC_LICENSE_KEY
* SES_ACCES_KEY_ID
* SES_ACCES_KEY_SECRET
* PASSPORT_JWT_SECRET
* COOKIE_SECRET: secret used to sign cookies
* PROTECT_PASSWORD: the password used to protect the environment (used on dev and demo)
* FRONTEND_BASE_URL
* WEEKLY_NOTIFICATIONS_ENABLED: enables weekly notification scheduling when thruthy
* WEEKLY_NOTIFICATIONS_SCHEDULE: `on monday at 4:00am` ([LaterJS](http://bunkat.github.io/later/parsers.html#text))
* NODE_ENV: `production` (to make sure the knex migrations use the production database url)
* MAINTENANCE_MODE: `false` (toggle maintenance mode)
* META_ROBOTS: `index, follow` (value for the 'robots' meta tag)
* ENABLE_SIGNUP_POPUP: `false` (show the signup popup on the stream page)
* EMAIL_QUEUE_ENABLED: enables mail queue processing
* EMAIL_QUEUE_SCHEDULE: `every 30 sec` ([LaterJS](http://bunkat.github.io/later/parsers.html#text))
* PIWIK_HOST: host to fetch piwik.js from and log events to
* PIWIK_SITE_ID: site_id to use in piwik event
* GOOGLE_ANALYTICS: when a GA tracking code is supplied, GA is enabled with that code

### Useful links

* [Wercker](https://app.wercker.com/#applications/5433de9fd90b47e23000007a)
* [New Relic](https://rpm.newrelic.com/accounts/1057147/applications/7544001)
* [Heroku](https://dashboard.heroku.com/apps/tippiq-node-staging/resources)
* [Sonar](http://ec2-52-18-105-18.eu-west-1.compute.amazonaws.com:9000/)
* [Kibana](http://52.31.225.117/)

## Creating private and public keys

A Microservice has to sign a request with its private when it needs to access a protected endpoint on another microservice.
Below is an example of how to create a private/public key pair using openssl:

Create a private key:
`openssl ecparam -name secp256k1 -genkey -noout -out private-key.pem`

Use private key to create a public key:
`openssl ec -in private-key.pem -pubout -out public-key.pem`


## Git workflow, deployment & release survival guide
This manual describes how we create releases and deploy the application.

Instead of a single master branch we use two separate branches for development and production. The `develop` branch is used for development. When a new feature is implemented a feature branch should be created based on the `develop` branch. The name of the branch should be `feature/tpx-<user story number>-<user story title>`. The feature is locally developed and tested. When the feature is complete a pullrequest should be made to the `develop` branch. When all team members have done their technical review the branch will be merged and removed. At this stage the testing environment will be automatically deployed using wercker.

All functional reviews will take place on the testing environment. When the feature has been approved a pullrequest will be made to merge `develop` into the `master` branch. The `develop` branch should not be removed after the merge. The acceptance environment will be build automatically on every change in the `master` branch using wercker.

Every week on monday the production environment will be updated manually based on the current
approved features in the `master` branch. At this stage the release will also be tagged with a version number. If a hotfix is needed in between releases a hotfix branch should be created with the following naming convention: `hotfix/tpx-<user story number>-<user story title>`. The hotfix is also developed and tested locally. When the hotfix is complete a pullrequest will be made to the `master` branch and `develop` branch. After the technical review of all team members the hotfix will be deployed automatically to the testing and acceptance environment. When the hotfix is approved by the productowner on the acceptance environment the production environment can be updated using the `master` branch.

The demo environment is an environment which is also deployed manually whenever an update is requested. The deployment will always be based on the `master` branch.

The documentation below describes the deployment- and release flow for every environment.

Do not deploy older versions of the application. This is in order to prevent issues with automatic database migrations.

#### Migrations
Migrations are executed automatically. Migrations that can't be executed using Knex should be done manually

## Workflow

```
┌─────────────┐  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│             │  │             │   │             │   │             │
│   Github    │  │   Wercker   │   │   Heroku    │   │     RDS     │
│ Repository  │──▶     CI      │──▶│ App. Server │◀═▶│  Database   │
│             │  │             │   │             │   │             │
└─────────────┘  └─────────────┘   └─────────────┘   └─────────────┘
```


## Style guide and coding conventions
Below is a list of style and coding conventions. Note the current codebase does not fully comply
with these rules. When touching existing code rewrite using these conventions.

### Promise chains
Always put every separate step of a promise chain on a new line. For example don't do:

    auth.validatePermissions(req, res, permissions.ADD_CARD)
      .then(() => {
        // Do something
      });

But do

    auth
      .validatePermissions(req, res, permissions.ADD_CARD)
      .then(() => {
        // Do something
       });

The only exception here is a promise chain as a one liner, for example:

    auth.validatePermissions(req, res, permissions.ADD_CARD).then(x => x + 1);

### Flatten promise chains
Whenever possible, try to flatten the promise chain. For example don't do:

    knex.schema.table('user_role', t => {
      t.dropColumns(['role']);
    }).then(() => {
      return knex.schema.dropTable('user_organization_role')
        .then(() => {
          return knex.schema.table('role', t => {
            t.dropColumns(['id']);
            t.renameColumn('name', 'label');
          });
      });
    });

But do

    knex.schema.table('user_role', t => {
      t.dropColumns(['role']);
    }).then(() => {
      return knex.schema.dropTable('user_organization_role');
    }).then(() => {
      return knex.schema.table('role', t => {
        t.dropColumns(['id']);
        t.renameColumn('name', 'label');
      });
    });

### Tap vs then
When a step in the promise chain doesn't provide a result for the next step (a.k.a. a side effect)
use `.tap` instead of `.then`. When using `.tap`, the output of the step prior to `.tap` is
automatically passed to step after `.tap`.

### Arrow function
Use arrow functions whenever possible, unless they harm readability. Also try to write them as
short as possible. Bad examples:

    function(x) {
      return x +1;
    }
    x => {
      return x + 1;
    }
    (x) => x + 1;

Good examples:

    x => x + 1;
    (x, y) => x + y;

### Error messages
Error messages always use the following format: "Invalid role: role is a required field."

### Order within the file
The order of code in each file should be:

1. requires
2. constants
3. exports
4. functions

