'use strict'

const test = require('tap').test
const proto1 = require('../lib/protocol1')

test('protocol1 rejects response without a line feed', (t) => {
  t.plan(2)
  proto1('yes')
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.notEqual(err.message.match(/invalid CAS 1.0/), null)
    })
})

test('protocol1 rejects bad validations', (t) => {
  t.plan(2)
  proto1('no\n')
    .then(() => t.fail('should not happen'))
    .catch((err) => {
      t.type(err, Error)
      t.notEqual(err.message.match(/bad validation/), null)
    })
})

test('protocol1 resolves good validations', (t) => {
  t.plan(2)
  proto1('yes\n')
    .then((result) => {
      t.type(result, 'boolean')
      t.is(result, true)
    })
    .catch((err) => t.threw(err))
})
