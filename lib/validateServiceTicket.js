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
<<<<<<< HEAD
        service: encodeURIComponent(self.serviceUrl)
      },
      strictSSL: self.strictSSL
=======
        service: self.serviceUrl
      }
>>>>>>> 4ab7042ca5dd391908e4efd8d900245238ec4355
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

      return resolve(self._validateServiceResponse(body));
    });
  }

  return new Promise(promise);
}

module.exports = validateServiceTicket;
