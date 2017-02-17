'use strict'

const http = require('http')
const test = require('tap').test
const common = require('./common')
const CAS = require('../cas')

test('cas client processes good responses', (t) => {
  t.plan(3)
  const xml = common.getFixture('protocol2_success.xml').toString()
  const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.end(xml)
  })

  server.listen(0, '127.0.0.1', () => {
    const address = server.address()
    const casOptions = {
      serverUrl: `http://127.0.0.1:${address.port}/`,
      serviceUrl: `http://127.0.0.1:${address.port}/`
    }
    const cas = new CAS(casOptions)

    cas
      .validateServiceTicket('ST-FOOBAR')
      .then((result) => {
        server.close()
        t.type(result, Object)
        t.is(result.hasOwnProperty('user'), true)
        t.is(result.user, 'username')
      })
      .catch((err) => {
        server.close()
        t.threw(err)
      })
  })
})

test('cas client rejects responses with bad status codes', (t) => {
  const server = http.createServer((req, res) => {
    res.statusCode = 500
    res.end('does not matter')
  })

  server.listen(0, '127.0.0.1', () => {
    t.plan(2)
    const address = server.address()
    const casOptions = {
      serverUrl: `http://127.0.0.1:${address.port}/`,
      serviceUrl: `http://127.0.0.2:${address.port}/`
    }
    const cas = new CAS(casOptions)

    cas
      .validateServiceTicket('ST-FOOBAR')
      .then(() => {
        server.close()
        t.fail('should not happen')
      })
      .catch((err) => {
        server.close()
        t.type(err, Error)
        t.notEqual(err.message.match(/status: 500/), null)
      })
  })
})

test('cas client rejects on bad response messages', (t) => {
  t.plan(2)
  const xml = common.getFixture('protocol2_failure.xml').toString()
  const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.end(xml)
  })

  server.listen(0, '127.0.0.1', () => {
    const address = server.address()
    const casOptions = {
      serverUrl: `http://127.0.0.1:${address.port}/`,
      serviceUrl: `http://127.0.0.1:${address.port}/`
    }
    const cas = new CAS(casOptions)

    cas
      .validateServiceTicket('ST-FOOBAR')
      .then(() => {
        server.close()
        t.fail('should not happen')
      })
      .catch((err) => {
        server.close()
        t.type(err, Error)
        t.notEqual(err.message.match(/INVALID_TICKET/), null)
      })
  })
})
