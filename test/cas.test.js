'use strict'

const test = require('tap').test
const common = require('./common')
const CAS = require('../cas.js')

test('cas constructor rejects invalid parameters', (t) => {
  t.plan(1)
  const parameters = {
    protocolVersion: 1.0
  }

  t.throws(() => new CAS(parameters), {message: /valid CAS/})
})

test('cas constructor recognizes strictSSL parameter', (t) => {
  t.plan(2)
  const parameters = {
    serverUrl: 'http://foo/bar',
    serviceUrl: 'http://foo/bar',
    strictSSL: false
  }

  const cas = new CAS(parameters)
  t.is(cas.hasOwnProperty('strictSSL'), true)
  t.is(cas.strictSSL, false)
})

test('cas constructor normalizes urls', (t) => {
  t.plan(2)
  const parameters = {
    serverUrl: 'http://example.com/cas/',
    serviceUrl: 'http://my.example.com/service/'
  }
  const cas = new CAS(parameters)

  t.is(cas.serverUrl.endsWith('/'), false)
  t.is(cas.serviceUrl.endsWith('/'), false)
})

test('cas client supports protocol 1.0', (t) => {
  t.plan(1)
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 1.0
  }
  const cas = new CAS(parameters)

  cas
    ._validateServiceResponse('yes\n')
    .then((result) => {
      t.is(result, true)
    })
    .catch((err) => t.threw(err))
})

test('cas client supports protocol 2.0', (t) => {
  t.plan(3)
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 2.0
  }
  const cas = new CAS(parameters)

  cas
    ._validateServiceResponse(common.getFixture('protocol2_success.xml'))
    .then((result) => {
      t.type(result, Object)
      t.is(result.hasOwnProperty('user'), true)
      t.is(result.user, 'username')
    })
    .catch((err) => t.threw(err))
})

test('cas client support protocol 3.0', (t) => {
  t.plan(7)
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 3.0
  }
  const cas = new CAS(parameters)

  cas
    ._validateServiceResponse(common.getFixture('protocol3_success.xml'))
    .then((result) => {
      t.type(result, Object)
      t.is(result.hasOwnProperty('user'), true)
      t.is(result.user, 'username')
      t.is(result.hasOwnProperty('attributes'), true)
      t.type(result.attributes, Object)
      t.is(result.attributes.hasOwnProperty('lastname'), true)
      t.is(result.attributes.lastname, 'Doe')
    })
    .catch((err) => t.threw(err))
})

test('cas client validates service tickets', (t) => {
  t.plan(1)
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 3.0
  }
  const cas = new CAS(parameters)
  t.doesNotThrow(() => cas.validateServiceTicket('foobar'))
})
