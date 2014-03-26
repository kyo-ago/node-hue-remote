var request = require('request');
var async = require('async');
var _ = require('lodash');

module.exports = (function () {
  "use strict";
  var HueRemote = function (options) {
    Object.keys(options).forEach(function (key) {
      this[key] = options[key];
    }.bind(this));
  };
  var prop = HueRemote.prototype;

  prop._getPlaySession = function (headers) {
    var key = Object.keys(headers).filter(function (key) {
      return key.replace(/\W/g, '').match(/SetCookie/i);
    });
    var session = _(headers[key]).filter(function (cookie) {
      return cookie.match(/PLAY_SESSION/i);
    }).map(function (session) {
      return session.split(/;/).filter(function (session) {
        return session.match(/PLAY_SESSION/i);
      });
    }).flatten().last();
    var match = session.match(/^\w+="(.+?)"$/);
    var result = (match || []).pop();
    if (!result) {
      throw new Error('missing PLAY_SESSION cookie');
    }
    return result;
  };

  prop.getStatus = function (callback) {
    var param = [
      ['token', this.accessToken],
      ['bridgeid', this.bridgeId]
    ].map(function (val) {
      return [val[0], encodeURIComponent(val[1])].join('=');
    }).join('&');
    console.log({
      'url' : 'https://www.meethue.com/api/getbridge?' + param,
      'headers' : {
        'Content-type' : 'application/x-www-form-urlencoded'
      }
    })
    request({
      'url' : 'https://www.meethue.com/api/getbridge?' + param,
      'headers' : {
        'Content-type' : 'application/x-www-form-urlencoded'
      }
    }, callback);
  };

  prop.setSessionId = function (sessionId) { this.sessionId = sessionId; }
  prop.getSessionId = function (callback) {
    var self = this;
    var blank = function (done) { done(null, self.sessionId); };
    if (self.sessionId) {
      return setTimeout(async.waterfall.bind(async, [blank], callback));
    }
    async.waterfall([
      function (done) {
        request('https://www.meethue.com/en-JP/login', function (error, response, body) {
          var match = body.match(/name="authenticityToken"\s+value="(.+?)"/);
          var token = (match || []).pop();
          var tokenError = token ? null : new Error('missing authenticityToken');
          var sessionId = self._getPlaySession(response['headers']);
          done(tokenError || error, sessionId, token);
        });
      }, function (sessionId, token, done) {
        var form = _.clone(self.account);
        form['authenticityToken'] = token;
        request.post('https://www.meethue.com/en-JP/loginpost', {
          'form' : form,
          'headers' : {
            'cookie' : 'PLAY_SESSION="'+sessionId+'"'
          }
        }, function (error, response, body) {
          var sessionId = self._getPlaySession(response['headers']);
          done(error, sessionId);
        });
      }
    ], callback);
  };

  prop.setBridgeId = function (bridgeId) { this.bridgeId = bridgeId; }
  prop.getBridgeId = function (callback) {
    var self = this;
    if (self.sessionId && self.bridgeId) {
      return setTimeout(async.waterfall.bind(async, [
        function (done) { done(null, self.sessionId, self.bridgeId); }
      ], callback));
    }
    async.waterfall([
      self.sessionId
        ? function (done) { done(null, sessionId); }
        : self.getSessionId
      ,
      function (sessionId, done) {
        request({
          'url' : 'https://www.meethue.com/en-JP/user/preferencessmartbridge',
          'headers' : {
            'cookie' : 'PLAY_SESSION="'+sessionId+'"'
          }
        }, function (error, response, body) {
          var match = body.match(/data-bridge="(.+?)"/);
          var bridgeId = (match || []).pop();
          var bridgeError = token ? null : new Error('missing data-bridge');
          var sessionId = self._getPlaySession(response['headers']);
          done(bridgeError || error, sessionId, bridgeId);
        });
      }
    ], callback);
  }

  prop.getAccessToken = function (callback) {
    var self = this;
    if (self.sessionId && self.accessToken) {
      return setTimeout(async.waterfall.bind(async, [
        function (done) { done(null, self.accessToken); }
      ], callback));
    }
    async.waterfall([
      self.sessionId
        ? function (done) { done(null, self.sessionId); }
        : self.getSessionId
      ,
      function (sessionId, done) {
        request({
          'url' : 'https://www.meethue.com/en-US/api/getaccesstokenpost',
          'headers' : {
            'cookie' : 'PLAY_SESSION="' + sessionId + '"'
          }
        }, function (error, response, body) {
          var match = body.match(/phHueRemoteapp:\/\/sdk\/login\/(.+?)"/);
          var accessToken = (match || []).pop();
          var tokenError = accessToken ? null : new Error('missing phHueRemoteapp://sdk/login/');
          var sessionId = self._getPlaySession(response['headers']);
          done(tokenError || error, sessionId, accessToken);
        });
      }
    ], callback);
  };

  prop.sendCommand = function (command, callback) {
    var self = this;
    async.waterfall([
      self.sessionId
        ? function (done) { done(null, self.sessionId); }
        : self.getSessionId
      ,
      self.bridgeId
        ? function (error, sessionId, done) { done(error, sessionId, self.bridgeId); }
        : self.getBridgeId
      ,
      function (error, sessionId, bridgeId, done) {
        self.accessToken
        ? done(error, sessionId, bridgeId, self.accessToken)
        : self.getAccessToken(function (error, sessionId, accessToken) {
          done(error, sessionId, bridgeId, accessToken);
        });
      },
      function (sessionId, bridgeId, accessToken, done) {
        var token = encodeURIComponent(accessToken);
        var sendMessageToBridge = 'https://www.meethue.com/en-US/user/sendMessageToBridge?token='+token
        request(sendMessageToBridge, {
          'contentType' : 'application/x-www-form-urlencoded',
          'method' : 'POST',
          'headers' : {
            'cookie' : 'PLAY_SESSION="'+sessionId+'";'
          },
          'form' : {
            'clipmessage' : JSON.stringify({
              'bridgeid' : bridgeId,
              'clipCommand' : command
            })
          }
        }, done);
      }
    ], callback);
  };

  return HueRemote;
})();
