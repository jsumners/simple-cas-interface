'use strict';

const debug = require('debug')('simple-cas-interface:xmlparser');

function XmlParser() {}

XmlParser.prototype.parse = function parse(jsxml) {
  debug('processing parsed xml');
  let msg;
  if (!jsxml.hasOwnProperty('serviceResponse')) {
    msg = 'An unknown response was received from CAS server: "' +
      `${JSON.stringify(jsxml)}"`;
    debug(msg);
    return Promise.reject(jsxml);
  }

  const body = jsxml.serviceResponse;
  if (body.hasOwnProperty('authenticationFailure')) {
    msg = 'Recieved bad validation from CAS server: "' +
      `${JSON.stringify(body.authenticationFailure)}"`;
    debug(msg);
    return Promise.reject(new Error(msg));
  }

  if (body.hasOwnProperty('authenticationSuccess')) {
    debug('Received good validation from CAS server');
    return Promise.resolve(body.authenticationSuccess);
  }
};

module.exports = XmlParser;
