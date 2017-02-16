'use strict'

const debug = require('debug')('simple-cas-interface:protocol1')

function validate (response) {
  function promise (resolve, reject) {
    let msg
    const parts = response.toLowerCase().split('\n')
    debug('response parts: %j', parts)
    if (parts.length < 2) {
      msg = `Received invalid CAS 1.0 validation response: ${response}`
      debug(msg)
      return reject(new Error(msg))
    }
    if (parts[0] === 'yes') {
      debug('Received good validation from CAS 1.0 server')
      return resolve(true)
    } else if (parts[0] === 'no') {
      msg = 'Received bad validation from CAS 1.0 server'
      debug(msg)
      return reject(new Error(msg))
    }
  }

  return new Promise(promise)
}

module.exports = validate
