'use strict';

const express = require('express');

const router = express.Router();

router.route('/search')
  .get(require('./actions/search-addresses').responseHandler);

router.route('/lookup')
  .get(require('./actions/lookup').responseHandler);

router.route('/find-by-address-type')
  .post(require('./actions/find-by-address-type').responseHandler);

exports.router = router;
