'use strict'

let log
module.exports = function getLogger (instance) {
  if (instance) {
    log = instance
    if (log.child) log = log.child({module: 'simple-cas-interface'})
  }
  if (!log) log = require('abstract-logging')
  return log
}
