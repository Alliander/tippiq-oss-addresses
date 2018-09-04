'use strict';

function latLonToGeojson(lat, lon) {
  return {
    type: 'Point',
    coordinates: [parseFloat(lon), parseFloat(lat)]
  };
}

const geoJSONHouseAddress = {type: 'Point', coordinates: [4.91652093, 52.33773322]}; // Spaklerweg 20, Amsterdam

exports.latLonToGeojson = latLonToGeojson;
exports.geoJSONHouseAddress = geoJSONHouseAddress;
