## Classes

<dl>
<dt><a href="#CAS">CAS</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CASParameters">CASParameters</a></dt>
<dd><p>Parameters object to specify configuration when creating a new <a href="#CAS">CAS</a>
object.</p>
</dd>
</dl>

<a name="CAS"></a>

## CAS
**Kind**: global class  
**Propety**: <code>string</code> loginUrl The full URL, with query parameters, to use when
 sending clients to the remote CAS server for authentication.  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| serverUrl | <code>string</code> | The base URL for the remote CAS server to which  all API methods will be appended. |
| serviceUrl | <code>string</code> | The local endpoint that the remote CAS server  will interact with, e.g. where clients will be redirected after login. |
| protocolVersion | <code>string</code> | The version of the CAS protocol that will  be used when communicating with the remote CAS server. |
| serviceValidateUri | <code>string</code> | The endpoint that will be used to  validate service tickets. |
| logoutUrl | <code>string</code> | The full URL, with query parameters, to use  when sending clients to the remote CAS server for authentication. |
| logger | <code>object</code> | An instance of a logger that conforms to the  Log4j interface. We recommend [https://npm.im/pino](https://npm.im/pino).  All logs except errors are logged at the 'trace' level. Errors are logged  at the 'error' level. |


* [CAS](#CAS)
    * [new CAS(parameters)](#new_CAS_new)
    * [.validateServiceTicket(ticket)](#CAS+validateServiceTicket) ⇒ <code>Promise</code>

<a name="new_CAS_new"></a>

### new CAS(parameters)
Instances of `CAS` provide convenient access to protocol URLs like
`/login` and `/logout`, as well as ticket verification.

**Throws**:

- <code>Error</code> When an invalid [CASParameters](#CASParameters) has been supplied.


| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>CasParameters</code> | An instance of [CasParameters](CasParameters). |

<a name="CAS+validateServiceTicket"></a>

### caS.validateServiceTicket(ticket) ⇒ <code>Promise</code>
After receiving a service ticket from the remote CAS server, use this
method to verify its authenticity.

**Kind**: instance method of <code>[CAS](#CAS)</code>  
**Resolve**: <code>object</code> an object the represents the `authenticationSuccess`
elements of the returned XML for protocols 2.0 and 3.0. For protocol 1.0
it will merely be `true`.  
**Reject**: <code>Error</code> If the ticket it is invalid, or some other issue occurred,
the promise will be rejected with an instance of `Error` that indicates why.  

| Param | Type | Description |
| --- | --- | --- |
| ticket | <code>string</code> | The service ticket string as returned from the  remote CAS server. |

<a name="CASParameters"></a>

## CASParameters
Parameters object to specify configuration when creating a new [CAS](#CAS)
object.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| serverUrl | <code>string</code> |  | The base URL for the CAS server to authtenticate  against, e.g `https://example.com/cas`. |
| serviceUrl | <code>string</code> |  | The URL to pass to the CAS server to indicate  where clients should be redirected to after authentication,  e.g `https://my.special.app/casAuthResponseHandler`. |
| protocolVersion | <code>number</code> | <code>2.0</code> | The CAS protocol version to use for  communicating with the remote CAS server. Default: `2.0`. |
| method | <code>string</code> | <code>&quot;GET&quot;</code> | The method the remote CAS server should use  when redirecting clients back to the provided `serviceUrl`.  Default: `GET` |
| useGateway | <code>boolean</code> | <code>false</code> | Indicates if login URLs should  include the `gateway` parameter. Default: `false`. |
| strictSSL | <code>boolean</code> | <code>true</code> | Specifies whether or not the client  should validate remote SSL certificates. Default: `true`. |
| logger | <code>object</code> |  | An instance of a logger that conforms  to the Log4j interface. We recommend [http://npm.im/pino](http://npm.im/pino). |

