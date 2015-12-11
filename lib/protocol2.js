'use strict';

const debug = require('debug')('simple-cas-interface:protocol2');
const xml2js = require('xml2js');

function validate(xml) {
  function promise(resolve, reject) {
    function parsedXml(err, parsed) {
      debug('processing parsed xml');
      let msg;
      if (err) {
        msg = `Could not parse CAS 2.0 server response as XML: "${err}"`;
        debug(msg);
        return reject(new Error(msg));
      }

      if (!parsed.hasOwnProperty('serviceResponse')) {
        msg = 'An unknown response was received from CAS 2.0 server: "' +
          `${JSON.stringify(parsed)}"`;
        debug(msg);
        return reject(parsed);
      }

      const body = parsed.serviceResponse;
      if (body.hasOwnProperty('authenticationFailure')) {
        msg = 'Recieved bad validation from CAS 2.0 server: "' +
          `${JSON.stringify(body.authenticationFailure)}"`;
        debug(msg);
        return reject(new Error(msg));
      }

      if (body.hasOwnProperty('authenticationSuccess')) {
        debug('Received good validation from CAS 2.0 server');
        return resolve(body.authenticationSuccess);
      }
    }

    debug('parsing xml');
    const parsed = xml2js.parseString(
      xml,
      {
        explicitArray: false,
        tagNameProcessors: [function (name) {
          return name.replace('cas:', '');
        }]
      },
      parsedXml
    );
  }

  return new Promise(promise);
}

module.exports = validate;