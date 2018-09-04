'use strict';

var _ = require('lodash');

exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
exports.redirect = redirect;
exports.render = render;
exports.sendResponse = sendResponse;
exports.sendCreated = sendCreated;
exports.sendCreatedWithProperties = sendCreatedWithProperties;
exports.catchResourceNotFoundError = catchResourceNotFoundError;
exports.catchInvalidUUIDError = catchInvalidUUIDError;
exports.send404 = send404;

function sendStatus(res, status, success, message) {
  res
    .status(status)
    .send({
      success: success,
      message: message
    });
}

function sendCreated(res, id) {
  res
    .set({'Location': res.req.baseUrl + '/' + id})
    .status(201)
    .send({
        success: true,
        message: 'Created',
        id: id
      });
}

function sendCreatedWithProperties(res, id, properties) {
  properties = properties || {};
  res
    .set({'Location': res.req.baseUrl + '/' + id})
    .status(201)
    .send(_.merge(
      {
        success: true,
        message: 'Created',
        id: id
      },
      properties)
    );
}

function sendResponse(res, status, body) {
  res
    .status(status)
    .send(body);
}

function catchResourceNotFoundError(res, exception) {
  // Unknown foreign key parentId
  if (exception.code === '23503') {
    sendError(res, 404, 'Not Found');
  } else {
    throw exception;
  }
}

function catchInvalidUUIDError(res, exception) {
  // invalid uuid
  if (exception.code === '22P02') {
    sendError(res, 404, 'Not Found, invalid UUID');
  } else {
    throw exception;
  }
}

function render(res, template, data) {
  res.render(template, data, function (err, page) {
    if (err) {
      throw err;
    } else {
      res.end(page);
    }
  });
}

function redirect(res, url) {
  res.redirect(url);
}

function sendSuccess(res, status, message) {
  sendStatus(res, status, true, message);
}

function sendError(res, status, message) {
  sendStatus(res, status, false, message);
}

function send404(req, res) {
  sendError(res, 404, 'Not Found');
}
