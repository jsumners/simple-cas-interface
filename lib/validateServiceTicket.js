'use strict';

const debug = require('debug')('simple-cas-interface:validateST');
const request = require('request');

function validateServiceTicket(ticket) {
  // We're using this hack because we can't re-bind the
  // `request` function without breaking it.
  /* jshint -W040 */
  const self = this;
  function promise(resolve, reject) {
    const reqOptions = {
      url: self.serverUrl + self.serviceValidateUri,
      qs: {
        ticket: ticket,
        service: self.serviceUrl
      },
      strictSSL: self.strictSSL
    };
    debug('validate url: %s', reqOptions.url);
    debug('validate qs: %j', reqOptions.qs);
    request(reqOptions, function reqCB(error, response, body) {
      if (error) {
        debug(error);
        return reject(error);
      }

      if (response.statusCode !== 200) {
        debug('Received status code: %s', response.statusCode);
        return reject(new Error(
          `CAS server returned status: ${response.statusCode}`
        ));
      }

      self._validateServiceResponse(body).then(resolve).catch(reject);
    });
  }

  return new Promise(promise);
}

module.exports = validateServiceTicket;
