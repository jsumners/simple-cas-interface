'use strict'

const test = require('tap').test
const common = require('./common')
const proto2 = require('../lib/protocol2')

test('protocol2 rejects authentication failures', (t) => {
  t.plan(2)
  const xml = common.getFixture('protocol2_failure.xml')
  proto2(xml)
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.notEqual(err.message.match(/bad validation/), null)
    })
})

test('protocol2 rejects bad responses', (t) => {
  t.plan(2)
  const xml = '<dsiafl,'
  proto2(xml)
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.notEqual(err.message.match(/Invalid character/), null)
    })
})

test('protocol2 resolves authentication successes', (t) => {
  t.plan(5)
  const xml = common.getFixture('protocol2_success.xml')
  proto2(xml)
    .then((result) => {
      t.type(result, Object)
      t.is(result.hasOwnProperty('user'), true)
      t.is(result.user, 'username')
      t.is(result.hasOwnProperty('proxyGrantingTicket'), true)
      t.notEqual(result.proxyGrantingTicket.match(/84678/), null)
    })
    .catch((err) => t.threw(err))
})
