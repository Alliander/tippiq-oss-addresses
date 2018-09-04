'use strict';

const express = require('express');
const router = express.Router();

const constants = Object.freeze({
  EVENTS: Object.freeze({
    API_INITIALIZED: 'app.api_initialized',
    ADDRESS_DATABASE_INITIALIZED: 'app.address_database_initialized'
  })
});

exports.constants = constants;
exports.router = router;

router.get('/', function (req, res) {
  res.json({ title: 'Tippiq API' });
});
