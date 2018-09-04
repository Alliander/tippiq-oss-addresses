'use strict';

exports.up = knex =>
  knex('notification_template')
    .insert(
      {
        id: 'dda859d1-6277-45cf-a2b6-8b8af0dc1c04',
        name: 'weekly-notifications',
        description: 'Standaard email huisbericht',
        'start_date': null,
        'end_date': null,
        subject: 'Tippiq Huisbericht | Wat er rond jouw huis gebeurt deze week',
        'html_top': '<h1>Dit is jouw persoonlijk overzicht met het belangrijkste van ' +
                'wat er rond jouw huis gebeurt, gevraagd en aangeboden wordt. ' +
                'Wil je dit overzicht aanpassen naar jouw persoonlijke behoeften? ' +
                'Dat kun je eenvoudig <a href="{{ settingsURL }}">hier</a> doen.</h1>',
        'html_bottom': '<h3><a href="{{ frontendBaseURL }}">Bekijk nu wat er rond je huis' +
                ' speelt</a></h3>',
        'text_top': 'Dit is jouw persoonlijk overzicht met het belangrijkste van ' +
                'wat er rond jouw huis gebeurt, gevraagd en aangeboden wordt.',
        'text_bottom': 'Je ontvangt deze mail omdat je hebt aangegeven deze wekelijks te' +
                ' willen ontvangen.'
      }
    );

exports.down = knex =>
  knex('notification_template')
    .where({ id: 'dda859d1-6277-45cf-a2b6-8b8af0dc1c04' })
    .del();
