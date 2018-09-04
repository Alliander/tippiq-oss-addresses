'use strict';

var BPromise = require('bluebird');
var knex = require('./../../common/bookshelf').knex;
var AddressRepository = require('./../addresses/address-repository');
var AddressLookupError = require('../../common/errors/address-lookup-error');
var Utils = require('./../../common/utils');
var Location = require('./location-model');

var _ = require('lodash');

var constants = Object.freeze({
  EVENTS: Object.freeze({
    LOCATION_UPDATED: 'locations.location_updated'
  })
});

exports.constants = constants;
exports.Location = Location;
exports.findById = findById;
exports.createLocation = createLocation;
exports.updateLocationWithId = updateLocationWithId;
exports.parseLocationJson = parseLocationJson;

function findOne(where) {
  return Location
    .where(where)
    .fetch({
      require: true,
      columns: [
        knex.raw('location.*'),
        knex.st.dutchGeometryToGeoJSON('location.geometry').as('geometry')
      ]
    })
    .then(jsonParseLocationGeometry);
}

function findById(id) {
  return findOne({id: id});
}

function geoJsonToGeometry(input) {
  return knex.st.dutchGeometryFromGeoJSON({
    type: input.type,
    coordinates: input.coordinates
  });
}

function locationRecordJsonFromLocationJson(inputObj) {
  inputObj.address = inputObj.address || {};
  inputObj.address.house = inputObj.address.house || {};
  inputObj.address.zipcode = inputObj.address.zipcode || {};

  var location = {
    type: inputObj.address.type,
    geometry: geoJsonToGeometry(inputObj.address.geometry),
    nr: inputObj.address.house.number,
    addition: inputObj.address.house.suffix,
    streetName: inputObj.address.street,
    zipcodeLetters: inputObj.address.zipcode.chars,
    zipcodeDigits: inputObj.address.zipcode.digits,
    cityName: inputObj.address.city,
    municipalityName: inputObj.address.municipality,
    provinceName: inputObj.address.province
  };

  return location;
}

function locationRecordJsonFromAddressModel(addressModel) {
  var serialized = addressModel.serialize({ context: 'address' });

  var location = {
    type: serialized.type,
    geometry: addressModel.get('geometry'),
    nr: serialized.nr,
    addition: serialized.addition,
    streetName: serialized.streetName,
    zipcodeLetters: serialized.zipcodeLetters,
    zipcodeDigits: serialized.zipcodeDigits,
    cityName: serialized.cityName,
    municipalityName: serialized.municipalityName,
    provinceName: serialized.provinceName
  };

  return location;
}

function updateLocationWithId(id, locationJson) {
  var locationRecordJson = locationRecordJsonFromLocationJson(locationJson);
  // TODO: wrap this in a transaction
  return findById(id)
    .then(function (locationRecord) {
      locationRecord.updateWith(locationRecordJson);
      return locationRecord.save();
    });
}

function jsonParseLocationGeometry(location) {
  location.attributes.geometry = JSON.parse(location.attributes.geometry);
  return location;
}

function locationFromProvince(addressInput) {
  return AddressRepository
    .findProvince({
      'province_name': addressInput.province
    })
    .catch(AddressRepository.ProvinceAddress.NotFoundError, function () {
      throw new AddressLookupError('Unable to find ProvinceAddress with name: ' + addressInput.name);
    })
    .then(function (address) {
      address.attributes.type = 'ProvinceAddress';
      return address;
    });
}

function locationFromHouse(addressInput) {
  addressInput = addressInput || {};
  addressInput.zipcode = addressInput.zipcode || {};
  addressInput.house = addressInput.house || {};

  return AddressRepository
    .findHouse({
      'zipcode_digits': addressInput.zipcode.digits,
      'zipcode_letters': Utils.uppercase(addressInput.zipcode.chars),
      'nr': addressInput.house.number,
      'suffix': addressInput.house.suffix
    })
    .catch(AddressRepository.HouseAddress.NotFoundError, function () {
      throw new AddressLookupError('Unable to find HouseAddress with zipcode: ' + addressInput.zipcode.digits +
        addressInput.zipcode.chars + ' and nr: ' + addressInput.house.number + addressInput.house.suffix);
    })
    .then(function (address) {
      address.attributes.type = 'HouseAddress';
      return address;
    });
}

function locationFromStreet(addressInput) {
  return AddressRepository
    .findStreet(_
      .chain({
        'street_name': addressInput.street,
        'city_name': addressInput.city,
        'province_name': addressInput.province
      })
      .pick(_.identity)
      .value())
    .catch(AddressRepository.StreetAddress.NotFoundError, function () {
      throw new AddressLookupError('Unable to find StreetAddress with name: ' + addressInput.street +
        ' in city: ' + addressInput.city + ' and province: ' + addressInput.province);
    })
    .then(function (address) {
      address.attributes.type = 'StreetAddress';
      return address;
    });
}

function locationFromCity(addressInput) {
  return AddressRepository
    .findCity(_
      .chain({
        'city_name': addressInput.city,
        'municipality_name': addressInput.municipality,
        'province_name': addressInput.province
      })
      .pick(_.identity)
      .value())
    .catch(AddressRepository.CityAddress.NotFoundError, function () {
      throw new AddressLookupError('Unable to find CityAddress with name: ' + addressInput.city +
        ' in municipality: ' + addressInput.municipality + ' and province: ' + addressInput.province);
    })
    .then(function (address) {
      address.attributes.type = 'CityAddress';
      return address;
    });
}

function locationFromMunicipality(addressInput) {
  return AddressRepository
    .findMunicipality(_
      .chain({
        'municipality_name': addressInput.municipality,
        'province_name': addressInput.province
      })
      .pick(_.identity)
      .value())
    .catch(AddressRepository.MunicipalityAddress.NotFoundError, function () {
      throw new AddressLookupError('Unable to find MunicipalityAddress with name: ' + addressInput.municipality +
        ' in province: ' + addressInput.province);
    })
    .then(function (address) {
      address.attributes.type = 'MunicipalityAddress';
      return address;
    });
}

function locationFromZipcode(addressInput) {
  var zipcode = addressInput.zipcode;
  var findAddress;
  if (zipcode.chars) {
    findAddress = AddressRepository
      .findZipcode6({
        'zipcode_digits': zipcode.digits,
        'zipcode_letters': Utils.uppercase(zipcode.chars)
      })
      .catch(AddressRepository.Zipcode6Address.NotFoundError, function () {
        throw new AddressLookupError('Unable to find ZipcodeAddress with zipcode: ' + zipcode.digits + zipcode.chars);
      });
  } else {
    findAddress = AddressRepository
      .findZipcode4({
        'zipcode_digits': zipcode.digits
      })
      .catch(AddressRepository.Zipcode4Address.NotFoundError, function () {
        throw new AddressLookupError('Unable to find ZipcodeAddress with zipcode: ' + zipcode.digits);
      });
  }
  return findAddress
    .then(function (address) {
      address.set('type', 'ZipcodeAddress');
      return address;
    });
}

function locationFromNetherlands() {
  var country = 'Nederland';

  return AddressRepository
    .findCountry({
      'country_name': country
    })
    .catch(AddressRepository.CountryAddress.NotFoundError, function () {
      throw new AddressLookupError('Unable to find CountryAddress with name: ' + country);
    })
    .then(function (address) {
      address.attributes.type = 'NetherlandsAddress';
      return address;
    });
}

function locationFromAddressInput(addressInput) {
  var findAddress;

  switch (addressInput.type) {
    case 'ProvinceAddress':
      findAddress = locationFromProvince(addressInput);
      break;

    case 'HouseAddress':
      findAddress = locationFromHouse(addressInput);
      break;

    case 'StreetAddress':
      findAddress = locationFromStreet(addressInput);
      break;

    case 'CityAddress':
      findAddress = locationFromCity(addressInput);
      break;

    case 'MunicipalityAddress':
      findAddress = locationFromMunicipality(addressInput);
      break;

    case 'ZipcodeAddress':
      findAddress = locationFromZipcode(addressInput);
      break;

    case 'NetherlandsAddress':
      findAddress = locationFromNetherlands();
      break;

    default:
      throw new AddressLookupError('Unknown address type: ' + addressInput.type);
  }

  return findAddress
    .then(function (address) {
      var locationRecordJson = locationRecordJsonFromAddressModel(address);
      return new Location(locationRecordJson);
    });
}

function locationFromGeometry(geometryInput) {
  var location;

  switch (geometryInput.type) {
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
      location = new Location({
        type: geometryInput.type,
        geometry: geoJsonToGeometry(geometryInput)
      });
      break;

    default:
      throw new Error('Unknown geometry type: ' + geometryInput.type);
  }

  return BPromise.resolve(location);
}

function createLocation(locationJson, enrichWithGeometryFromAddressesDatabase, transaction) {
  var location;

  if (enrichWithGeometryFromAddressesDatabase) {
    location = parseLocationJson(locationJson);
  } else {
    var locationRecordJson = locationRecordJsonFromLocationJson(locationJson);
    location = BPromise.resolve(new Location(locationRecordJson));
  }

  return location
    .then(function (locationModel) {
      return locationModel.save(null, Utils.bookshelfOptions(transaction));
    });
}

function parseLocationJson(locationJson) {
  if (typeof locationJson.address !== 'undefined') {
    return locationFromAddressInput(locationJson.address)
      .then(function (location) {
        // Override the geometry if set by the user
        if (typeof locationJson.geometry !== 'undefined') {
          location.set('geometry', geoJsonToGeometry(locationJson.geometry));
        }
        return location;
      });
  }
  if (typeof locationJson.geometry !== 'undefined') {
    return locationFromGeometry(locationJson.geometry)
      .then(function (geometryLocation) {
        // if (typeof locationJson.address !== 'undefined') {
        //   //TODO: also set address fields if set by user
        // }
        return geometryLocation;
      });
  }
  throw new Error('Processing unknown location type: neither geometry nor address specified.');
}
