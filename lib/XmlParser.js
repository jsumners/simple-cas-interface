'use strict'

const log = require(require.resolve('./logger'))()

function XmlParser () {}

XmlParser.prototype.parse = function parse (jsxml) {
  log.trace('processing parsed xml')
  let msg
  if (!jsxml.hasOwnProperty('serviceResponse')) {
    msg = 'An unknown response was received from CAS server: "' +
      `${JSON.stringify(jsxml)}"`
    log.trace(msg)
    return Promise.reject(jsxml)
  }

  const body = jsxml.serviceResponse
  if (body.hasOwnProperty('authenticationFailure')) {
    msg = 'Recieved bad validation from CAS server: "' +
      `${JSON.stringify(body.authenticationFailure)}"`
    log.trace(msg)
    return Promise.reject(new Error(msg))
  }

  if (body.hasOwnProperty('authenticationSuccess')) {
    log.trace('Received good validation from CAS server')
    return Promise.resolve(body.authenticationSuccess)
  }
}

module.exports = XmlParser
