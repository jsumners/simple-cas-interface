'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const http = require('http');
const CAS = require('../cas');

suite('Validate Service Ticket');

test('good response', function validTickets(done) {
  const xml = fs.readFileSync(__dirname + '/fixtures/protocol2_success.xml');
  const server = http.createServer(function (req, res) {
    res.statusCode = 200;
    res.end(xml.toString());
  });

  server.listen(9000, function() {
    const casOptions = {
      serverUrl: 'http://127.0.0.1:9000/',
      serviceUrl: 'http://127.0.0.1:9000/'
    };
    const cas = new CAS(casOptions);

    cas
      .validateServiceTicket('ST-FOOBAR')
      .then(function resolved(response) {
        server.close();
        expect(response).to.be.an.object;
        expect(response).to.have.property('user');
        expect(response.user).to.equal('username');
        done();
      })
      .catch((err) => {
        server.close();
        done(err);
      });
  });
});

test('bad status code', function badStatusCode(done) {
  const server = http.createServer(function (req, res) {
    res.statusCode = 500;
    res.end('does not matter');
  });

  server.listen(9001, function() {
    const casOptions = {
      serverUrl: 'http://127.0.0.1:9001/',
      serviceUrl: 'http://127.0.0.1:9001/'
    };
    const cas = new CAS(casOptions);

    cas
      .validateServiceTicket('ST-FOOBAR')
      .then(function resolved(){})
      .catch(function caught(error) {
        server.close();
        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.include('status: 500');
        done();
      });
  });
});

test('bad response message', function badMessage(done) {
  const xml = fs.readFileSync(__dirname + '/fixtures/protocol2_failure.xml');
  const server = http.createServer(function (req, res) {
    res.statusCode = 200;
    res.end(xml);
  });

  server.listen(9002, function() {
    const casOptions = {
      serverUrl: 'http://127.0.0.1:9002/',
      serviceUrl: 'http://127.0.0.1:9002/'
    };
    const cas = new CAS(casOptions);

    cas
      .validateServiceTicket('ST-FOOBAR')
      .then(function resolved(){})
      .catch(function caught(error) {
        server.close();
        expect(error).to.be.an.instanceof(Error);
        expect(error.message).to.include('INVALID_TICKET');
        done();
      })
  });
});
