'use strict'

const test = require('tap').test
const common = require('./common')
const proto3 = require('../lib/protocol3')

test('protocol3 rejects authentication failures', (t) => {
  t.plan(2)
  const xml = common.getFixture('protocol2_failure.xml')
  proto3(xml)
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.notEqual(err.message.match(/bad validation/), null)
    })
})

test('protocol3 rejects bad responses', (t) => {
  t.plan(2)
  const xml = '<dsiafl,'
  proto3(xml)
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.notEqual(err.message.match(/Invalid character/), null)
    })
})

test('protocol3 resolves authentication successes', (t) => {
  t.plan(9)
  const xml = common.getFixture('protocol3_success.xml')
  proto3(xml)
    .then((result) => {
      t.type(result, Object)
      t.is(result.hasOwnProperty('user'), true)
      t.is(result.user, 'username')
      t.is(result.hasOwnProperty('proxyGrantingTicket'), true)
      t.notEqual(result.proxyGrantingTicket.match(/84678/), null)
      t.is(result.hasOwnProperty('attributes'), true)
      t.type(result.attributes, Object)
      t.is(result.attributes.hasOwnProperty('lastname'), true)
      t.is(result.attributes.lastname, 'Doe')
    })
    .catch((err) => t.threw(err))
})
