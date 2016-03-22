'use strict';

const fs = require('fs');
const expect = require('chai').expect;

suite('CAS');
const CAS = require('../cas.js');

it('Rejects invalid parameters', function invalidParamsTest(done) {
  const parameters = {
    protocolVersion: 1.0
  };

  expect(function(){return new CAS(parameters);}).to.throw(/valid CAS/);
  done();
});

it('Recognizes strictSSL parameter', function strictSSLTest(done) {
  const parameters = {
    serverUrl: 'http://foo/bar',
    serviceUrl: 'http://foo/bar',
    strictSSL: false
  };

  const cas = new CAS(parameters);
  expect(cas.strictSSL).to.exist;
  expect(cas.strictSSL).to.be.false;
  done();
});

it('Normalizes URLs', function normalizeUrlsTest(done) {
  const parameters = {
    serverUrl: 'http://example.com/cas/',
    serviceUrl: 'http://my.example.com/service/'
  };
  const cas = new CAS(parameters);

  expect(cas.serverUrl.endsWith('/')).to.be.false;
  expect(cas.serviceUrl.endsWith('/')).to.be.false;
  done();
});

it('Supports protocol 1.0', function prot1(done) {
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 1.0
  };
  const cas = new CAS(parameters);

  cas
    ._validateServiceResponse('yes\n')
    .then(function resolved(result) {
      expect(result).to.be.true;
      done();
    });
});

it('Supports protocol 2.0', function prot2(done) {
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 2.0
  };
  const cas = new CAS(parameters);

  cas
    ._validateServiceResponse(
      fs.readFileSync(__dirname + '/fixtures/protocol2_success.xml')
    )
    .then(function resolved(result) {
      expect(result).to.be.an.object;
      expect(result).to.have.property('user');
      expect(result.user).to.equal('username');
      done();
    });
});

it('Supports protocol 3.0', function prot2(done) {
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 3.0
  };
  const cas = new CAS(parameters);

  cas
    ._validateServiceResponse(
      fs.readFileSync(__dirname + '/fixtures/protocol3_success.xml')
    )
    .then(function resolved(result) {
      expect(result).to.be.an.object;
      expect(result).to.have.property('user');
      expect(result.user).to.equal('username');
      expect(result).to.have.property('attributes');
      expect(result.attributes).to.be.an.object;
      expect(result.attributes).to.have.property('lastname');
      expect(result.attributes.lastname).to.equal('Doe');
      done();
    });
});

it('Validates Service Tickets', function validateTicket(done) {
  const parameters = {
    serverUrl: 'http://foo/bar/',
    serviceUrl: 'http://foo/bar/',
    protocolVersion: 3.0
  };
  const cas = new CAS(parameters);

  cas.validateServiceTicket('foobar');
  done();
});

suite('Protocol 1.0');
const proto1 = require('../lib/protocol1');

it('Rejects responses without a line feed', function nolfreject(done) {
  proto1('yes')
    .then(function resolved(){})
    .catch(function caught(result) {
      expect(result).to.be.an.instanceof(Error);
      expect(result.message).to.include('invalid CAS 1.0');
      done();
    });
});

it('Rejects bad validations', function badvalid(done) {
  proto1('no\n')
    .then(function resolved(){})
    .catch(function caught(result) {
      expect(result).to.be.an.instanceof(Error);
      expect(result.message).to.include('bad validation');
      done();
    });
});

it('It resolves good validations', function goodvalid(done) {
  proto1('yes\n')
    .then(function resolved(result) {
      expect(result).to.be.a.boolean;
      expect(result).to.be.true;
      done();
    })
    .catch(function caught(){})
});

suite('Protocol 2.0');
const proto2 = require('../lib/protocol2');

it('Rejects authentication failures', function authfail2(done) {
  const xml = fs.readFileSync(__dirname + '/fixtures/protocol2_failure.xml');
  proto2(xml)
    .then(function resolved(){})
    .catch(function caught(result) {
      expect(result).to.be.an.instanceof(Error);
      expect(result.message).to.include('bad validation');
      done();
    });
});

it('Rejects bad responses', function authboo2(done) {
  const xml = '<dsiafl,';
  proto2(xml)
    .then(function resolved(wut){
      done(wut);
    })
    .catch(function caught(result) {
      expect(result).to.be.an.instanceof(Error);
      expect(result.message).to.include('Invalid character');
      done();
    });
});

it('Resolves authentication successes', function authyay2(done) {
  const xml = fs.readFileSync(__dirname + '/fixtures/protocol2_success.xml');
  proto2(xml)
    .then(function resolved(success) {
      expect(success).to.be.an.object;
      expect(success).to.have.property('user');
      expect(success.user).to.equal('username');
      expect(success).to.have.property('proxyGrantingTicket');
      expect(success.proxyGrantingTicket).to.include('84678');
      done();
    })
    .catch(function caught(){})
});

suite('Protocol 3.0');
const proto3 = require('../lib/protocol3');

it('Rejects authentication failures', function authfail2(done) {
  const xml = fs.readFileSync(__dirname + '/fixtures/protocol2_failure.xml');
  proto3(xml)
    .then(function resolved(){})
    .catch(function caught(result) {
      expect(result).to.be.an.instanceof(Error);
      expect(result.message).to.include('bad validation');
      done();
    });
});

it('Rejects bad responses', function authboo2(done) {
  const xml = '<dsiafl,';
  proto3(xml)
    .then(function resolved(){})
    .catch(function caught(result) {
      expect(result).to.be.an.instanceof(Error);
      expect(result.message).to.include('Invalid character');
      done();
    });
});

it('Resolves authentication successes', function authyay2(done) {
  const xml = fs.readFileSync(__dirname + '/fixtures/protocol3_success.xml');
  proto3(xml)
    .then(function resolved(success) {
      expect(success).to.be.an.object;
      expect(success).to.have.property('user');
      expect(success.user).to.equal('username');
      expect(success).to.have.property('proxyGrantingTicket');
      expect(success.proxyGrantingTicket).to.include('84678');
      expect(success).to.have.property('attributes');
      expect(success.attributes).to.be.an.object;
      expect(success.attributes).to.have.property('lastname');
      expect(success.attributes.lastname).to.equal('Doe');
      done();
    })
    .catch(function caught(){})
});
