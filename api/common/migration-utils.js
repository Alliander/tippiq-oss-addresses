/* eslint-disable max-params */
'use strict';

exports.replaceColumn = replaceColumn;

/**
 * Helper function to alter a column by replacing it with a new one. The new column should be created in the callback
 * function which will be pulled into the promise chain and knex transaction. The callback receives the parameters
 * table, columnName and swapColumnName (which will contain the previous column for reference). When the callback
 * has finished the data from swapColumnName is put into columnName.
 * @param {object} knex Engine reference
 * @param {Promise} Promise to build the result with
 * @param {string} tableName that contains the column
 * @param {string} columnName to change
 * @param {function} callback that should create the new column
 * @returns {*} Promise that indicates success or failure
 */
function replaceColumn(knex, Promise, tableName, columnName, callback) {
  var swapColumnName = columnName + '_swap';
  return Promise
    .resolve(knex.schema.table(tableName, function (t) {
        t.renameColumn(columnName, swapColumnName);
      })
      .table(tableName, function (table) {
        return callback(table, columnName, swapColumnName);
      }))
    .then(function () {
      return knex(tableName).update(columnName, knex.raw('"' + swapColumnName + '"'));
    })
    .then(function () {
      return knex.schema.table(tableName, function (t) {
        t.dropColumns([swapColumnName]);
      });
    });
}
