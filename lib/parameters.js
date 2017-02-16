'use strict'

const log = require(require.resolve('./logger'))()
const Joi = require('joi')

/**
 * Parameters object to specify configuration when creating a new {@link CAS}
 * object.
 *
 * @typedef CASParameters
 * @property {string} serverUrl The base URL for the CAS server to authtenticate
 *  against, e.g <tt>https://example.com/cas</tt>.
 * @property {string} serviceUrl The URL to pass to the CAS server to indicate
 *  where clients should be redirected to after authentication,
 *  e.g <tt>https://my.special.app/casAuthResponseHandler</tt>.
 * @property {number} [protocolVersion=2.0] The CAS protocol version to use for
 *  communicating with the remote CAS server. Default: <tt>2.0</tt>
 * @property {string} [method=GET] The method the remote CAS server should use
 *  when redirecting clients back to the provided <tt>serviceUrl</tt>.
 *  Default: <tt>GET</tt>
 * @property: {boolean} [useGateway=false] Indicates if login URLs should
 *  include the <tt>gateway</tt> parameter. Default: <tt>false</tt>
 * @property: {boolean} [strictSSL=true] Specifies whether or not the client
 *  should validate remote SSL certificates. Default: <tt>true</tt>
 */
const CASParameters =
  Joi.object().keys({
    serverUrl: Joi.string().uri(['http', 'https']).required(),
    serviceUrl: Joi.string().uri(['http', 'https']).required(),
    protocolVersion: Joi.number().valid([1, 2, 3]).default(2.0),
    method: Joi.string().valid(['GET', 'POST']).default('GET'),
    useGateway: Joi.boolean().default(false),
    strictSSL: Joi.boolean().default(true)
  })

CASParameters.normalizeUrl = function (url) {
  log.trace('normalizing url: %s', url)
  return (url.endsWith('/')) ? url.substr(0, url.length - 1) : url
}

CASParameters.validate = function (params) {
  log.trace('validating parameters: %j', params)
  return Joi.validate(params, CASParameters)
}

module.exports = CASParameters
