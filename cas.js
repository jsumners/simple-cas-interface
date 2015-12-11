'use strict';

const debug = require('debug')('simple-cas-interface:main');
const CasParameters = require(__dirname + '/lib/parameters');

/**
 * <p>Instances of <tt>CAS</tt> provide convenient access to protocol URLs like
 * '/login' and '/logout', as well as ticket verification.</p>
 *
 * @param {CasParameters} parameters An instance of {@link CasParameters}.
 *  Required.
 * @constructor
 * @property {string} serverUrl The base URL for the remote CAS server to which
 *  all API methods will be appended.
 * @property {string} serviceUrl The local endpoint that the remote CAS server
 *  will interact with, e.g. where clients will be redirected after login.
 * @property {string} protocolVersion The version of the CAS protocol that will
 *  be used when communicating with the remote CAS server.
 * @property {string} serviceValidateUri The endpoint that will be used to
 *  validate service tickets.
 * @propety {string} loginUrl The full URL, with query parameters, to use when
 *  sending clients to the remote CAS server for authentication.
 * @property {string} logoutUrl The full URL, with query parameters, to use
 *  when sending clients to the remote CAS server for authentication.
 * @throws {Error} When an invalid {@link CASParameters} has been supplied.
 */
function CAS(parameters) {
  const validation = CasParameters.validate(parameters);
  if (validation.error !== null) {
    debug(validation.error.message);
    throw new Error('Must supply a valid CAS parameters object');
  }

  Object.defineProperties(this, {
    serverUrl: {
      value: CasParameters.normalizeUrl(validation.value.serverUrl)
    },
    serviceUrl: {
      value: CasParameters.normalizeUrl(validation.value.serviceUrl)
    },
    protocolVersion: {
      value: validation.value.protocolVersion + 0
    }
  });
  debug('cas.serverUrl: %s', this.serverUrl);
  debug('cas.serviceUrl: %s', this.serviceUrl);
  debug('cas.protocolVersion: %s', this.protocolVersion);

  switch (this.protocolVersion) {
    case 1:
      Object.defineProperty(this, 'serviceValidateUri', {value: '/validate'});
      this._validateServiceResponse = require(__dirname + '/lib/protocol1');
      break;
    case 2:
      Object.defineProperty(
        this,
        'serviceValidateUri',
        {value: '/serviceValidate'}
      );
      this._validateServiceResponse = require(__dirname + '/lib/protocol2');
      break;
    case 3:
      Object.defineProperty(
        this,
        'serviceValidateUri',
        {value: '/p3/serviceValidate'}
      );
      this._validateServiceResponse = require(__dirname + '/lib/protocol3');
  }

  const queryParameters = {
    service: encodeURIComponent(this.serviceUrl)
  };

  if (validation.value.renew && !validation.value.gateway) {
    queryParameters.renew = true;
  } else if (validation.value.gateway) {
    queryParameters.gateway = true;
  }

  if (validation.value.method !== 'GET') {
    queryParameters.method = 'POST';
  }

  const qs = (function() {
    let result = '';
    for (let p of Object.keys(queryParameters)) {
      result += `&${p}=${queryParameters[p]}`;
    }
    return '?' + result.substr(1);
  }());
  Object.defineProperty(this, 'loginUrl', {
    value: this.serverUrl + '/login' + qs
  });
  debug('cas.loginUrl: %s', this.loginUrl);

  Object.defineProperty(this, 'logoutUrl', {
    value: this.serverUrl + '/logout' + '?service=' + queryParameters.service
  });
  debug('cas.logoutUrl: %s', this.logoutUrl);
}

/**
 * <p>After receiving a service ticket from the remote CAS server, use this
 * method to verify its authenticity.</p>
 *
 * @param {string} ticket The service ticket string as returned from the
 *  remote CAS server.
 * @returns {Promise} <p>A <tt>Promise</tt> that resolves if the ticket is a
 *  valid service ticket. The parameter passed to the resolve function will be
 *  an object the represents the <tt>authenticationSuccess</tt> elements of
 *  the returned XML for protocols 2.0 and 3.0. For protocol 1.0 it will merely
 *  be <tt>true</tt>.</p>
 *
 *  <p>If the ticket it is invalid, or some other issue occurred,
 *  the promise will be rejected with an instance of <tt>Error</tt> that
 *  indicates why.</p>
 */
CAS.prototype.validateServiceTicket = function vt(ticket) {
  const func = require(__dirname + '/lib/validateServiceTicket');
  return func.call(this, ticket);
};

module.exports = CAS;