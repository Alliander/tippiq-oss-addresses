exports.knexPostgisExtensions = function knexPostgisExtensions(knex, formatter) {
  return {
    setSRID: function (geom, srid) {
      return knex.raw('ST_SetSRID(?, ?)', [formatter.wrapWKT(geom), srid]);
    },
    distance: function (from, to) {
      return knex.raw('ST_Distance(?, ?)', [formatter.wrapWKT(from), formatter.wrapWKT(to)]);
    },
    makePoint: function (longitudeColumn, latitudeColumn) {
      return knex.raw('ST_MakePoint(cast(? as float),cast(? as float))', [
        formatter.wrapWKT(longitudeColumn), formatter.wrapWKT(latitudeColumn)
      ]);
    },
    distanceBetweenColumnAndGeoJson: function (sourceColumn, geoJson, asColumn) {
      // These links explain how to convert to the correct distance units.
      // http://gis.stackexchange.com/questions/133450/st-distance-values-in-kilometers
      // http://epsg.io/28992 transformation for NL
      var distance = knex.st.distance(
        formatter.wrapWKT(sourceColumn),
        knex.st._setDutchSRID(knex.st.geomFromGeoJSON(geoJson))
      );
      if (asColumn) {
        return distance.as(asColumn);
      }
      return distance;
    },
    dwithin: function (from, geoJson, distance) {
      return knex.raw('ST_DWithin(?, ?, ?)', [
        formatter.wrapWKT(from),
        knex.st._setDutchSRID(knex.st.geomFromGeoJSON(geoJson)),
        formatter.wrapWKT(distance)
      ]);
    },
    dutchGeometryToGeoJSON: function (geometry) {
      return knex.st._asGeoJSON(knex.st.transform(geometry, 4326));
    },
    dutchGeometryFromGeoJSON: function (geojson) {
      return knex.st._setDutchSRID(knex.st.geomFromGeoJSON(geojson));
    },
    dutchMakePoint: function (longitudeColumn, latitudeColumn) {
      return knex.st._setDutchSRID(this.makePoint(longitudeColumn, latitudeColumn));
    },
    _setDutchSRID: function (geometry) {
      return knex.st.transform(knex.st.setSRID(geometry, 4326), 28992);
    },
    _asGeoJSON: function (geom) {
      return knex.raw('ST_asGeoJSON(?)', [geom]);
    }
  };
};
