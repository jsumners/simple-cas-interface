# simple-cas-interface

This module provides a simple interface for interacting with a [CAS][cas] 
server. Based on the parameters you provide it, it will generate all of the
necessary URLs for communicating with the server. It also provides methods for
verifying the validity of CAS tickets.

There are several other CAS clients available, but they are either narrowly
defined for specific institutions or are tied to specific frameworks like
Express. To be framework agnositic, the only interaction this module directly
has with the remote CAS server is when validating tickets. All other
interactions are left up to your application or other modules. One such
implementation is the [hapi-cas module][hapi-cas].

This module follows the [specification][spec] and implements protocol version
1.0, 2.0, and 3.0.

This module is fully documented in the [api.md](api.md) document.

**Note:** CAS's proxy granting ticket protocol is not yet supported. Basically
because this author doesn't quite understand it or its purpose.

[cas]: http://jasig.github.io/cas/
[spec]: https://github.com/Jasig/cas/blob/master/cas-server-documentation/protocol/CAS-Protocol-Specification.md
[hapi-cas]: https://npmjs.com/hapi-cas

## Install

```bash
$ npm install --save --production simple-cas-interface
```

## Usage

```javascript
const CAS = require('simple-cas-interface');
const casOptions = {
  serverUrl: 'https://cas.example.com/',
  serviceUrl: 'https://myapp.example.com/casHandler',
  protocolVersion: 3.0
};

const cas = new CAS(casOptions);

// Create some end point in your app that redirects users to
cas.loginUrl;

// After the user authenticates they will be sent to the `/casHandler` end
// point. The casHandler endpoint should retrieve the service ticket from the
// URL query parameters and submit it to:
cas
  .validateServiceTicket('the ticket')
  .then(function resolved(msg) {
    // the ticket successfully authenticated
  })
  .catch(function caught(error) {
    // the ticket did not authenticate
  });
```

## License

[MIT License](http://jsumners.mit-license.org/)
