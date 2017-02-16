'use strict'

const log = require(require.resolve('./logger'))()

function validate (response) {
  function promise (resolve, reject) {
    let msg
    const parts = response.toLowerCase().split('\n')
    log.trace('response parts: %j', parts)
    if (parts.length < 2) {
      msg = `Received invalid CAS 1.0 validation response: ${response}`
      log.trace(msg)
      return reject(new Error(msg))
    }
    if (parts[0] === 'yes') {
      log.trace('Received good validation from CAS 1.0 server')
      return resolve(true)
    } else if (parts[0] === 'no') {
      msg = 'Received bad validation from CAS 1.0 server'
      log.trace(msg)
      return reject(new Error(msg))
    }
  }

  return new Promise(promise)
}

module.exports = validate
