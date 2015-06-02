This library is deprecated
===============

Doesn't work on now.

node-hue-remote
===============

Controls the hue of the remote.

Install
===============

npm install node-hue-remote

Usage
===============

```javascript
var HueRemote = require('HueRemote');
var hue = new HueRemote({
  'account' : {
    'email': 'Your registered email at www.meethue.com',
    'password': 'Your registered password at www.meethue.com'
  }
});
hue.sendCommand({
  // '/api/0/' is does not change.
  // Change 'lights/0/state' to another API address.(remove '/api/<usename>/')
  // Ex. '/api/0/api', '/api/0/lights', '/api/0/lights/new', '/api/0/lights/<id>', 
  'url' : '/api/0/lights/0/state',
  'method' : 'PUT',
  'body' : {
    'on' : false
  }
}, function (error, sessionId, bridgeId, accessToken, body) {
  var response = JSON.parse(body);
  if (error || (response.result !== 'ok')) {
    throw new Error(error || body);
  }
  // save to cache.
  hue.setSessionId(sessionId);
  hue.setBridgeId(bridgeId);
  hue.setAccessToken(accessToken);
});
```

License
===============

MIT License.

Note
===============

[Meet hue](http://meethue.com/)

[Introduction - Philips hue API](http://developers.meethue.com/)

[Philips Hue Remote API Explained](http://blog.paulshi.me/technical/2013/11/27/Philips-Hue-Remote-API-Explained.html)
