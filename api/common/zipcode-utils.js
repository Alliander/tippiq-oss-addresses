'use strict';

function normalizeZipcode(input) {
  return input.replace(/[^0-9a-z]/gi, '')
    .toUpperCase()
    .substring(0, 6);
}

function parseZipcodeInput(zipcode) {
  zipcode = zipcode || '';
  zipcode = normalizeZipcode(zipcode);

  return {
    digits: zipcode.substring(0, 4),
    chars: zipcode.substring(4, 6)
  };
}

exports._normalizeZipcode = normalizeZipcode;
exports.parseZipcodeInput = parseZipcodeInput;
