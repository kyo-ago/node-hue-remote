var HueRemote = require('../lib/HueRemote');

describe('HueRemote', function () {
  var account = {
      'email': '',
      'password': ''
  };

  describe('constructor', function () {
    it('should successfl', function () {
      expect(function () {
        new HueRemote({});
      }).to.not.throw();
    });
    it('should set parameters', function () {
      var hue = new HueRemote({'account' : account});
      expect(hue.account).to.eql(account);
    });
  });
  describe('sessionId', function () {
    var hue = new HueRemote({'account' : account});
    it('should successfl', function (done) {
      this.timeout(30000);
      hue.getSessionId(function (error, sessionId) {
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        hue.setSessionId(sessionId);
        done();
      });
    });
    it('should be retried to successfl', function (done) {
      var sync = true;
      hue.getSessionId(function (error, sessionId) {
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        expect(hue.sessionId).to.eql(sessionId);
        expect(sync).to.be.false;
        done();
      });
      sync = false;
    });
  });
  describe('bridgeId', function () {
    var hue = new HueRemote({'account' : account});
    it('should successfl', function (done) {
      this.timeout(30000);
      hue.getBridgeId(function (error, sessionId, bridgeId) {
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        expect(!!bridgeId).to.not.be.false;
        hue.setSessionId(sessionId);
        hue.setBridgeId(bridgeId);
        done();
      });
    });
    it('should be retried to successfl', function (done) {
      var sync = true;
      hue.getBridgeId(function (error, sessionId, bridgeId) {
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        expect(!!bridgeId).to.not.be.false;
        expect(hue.sessionId).to.eql(sessionId);
        expect(hue.bridgeId).to.eql(bridgeId);
        expect(sync).to.be.false;
        done();
      });
      sync = false;
    });
  });
  describe('accessToken', function () {
    var hue = new HueRemote({'account' : account});
    it('should successfl', function (done) {
      this.timeout(30000);
      hue.getAccessToken(function (error, sessionId, bridgeId, accessToken) {
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        expect(!!bridgeId).to.not.be.false;
        expect(!!accessToken).to.not.be.false;
        hue.setSessionId(sessionId);
        hue.setBridgeId(bridgeId);
        hue.setAccessToken(accessToken);
        done();
      });
    });
    it('should be retried to successfl', function (done) {
      var sync = true;
      hue.getAccessToken(function (error, sessionId, bridgeId, accessToken) {
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        expect(!!bridgeId).to.not.be.false;
        expect(!!accessToken).to.not.be.false;
        expect(hue.sessionId).to.eql(sessionId);
        expect(hue.bridgeId).to.eql(bridgeId);
        expect(hue.accessToken).to.eql(accessToken);
        expect(sync).to.be.false;
        done();
      });
      sync = false;
    });
  });
  describe('getStatus', function () {
    it('should successfl', function (done) {
      this.timeout(30000);
      var hue = new HueRemote({
        'account' : account,
        'bridgeid' : bridgeid
      });
      hue.getStatus(function (error, response, body) {
        expect(body.length).to.not.eql(0);
        done();
      });
    });
  });
  describe('sendCommand', function () {
    var hue = new HueRemote({'account' : account});
    it('should successfl', function (done) {
      this.timeout(30000);
      hue.sendCommand({
        'url' : '/api/0/lights/3/state',
        'method' : 'POST',
        'body' : {
          'on' : false
        }
      }, function (error, sessionId, bridgeId, accessToken, body) {
        console.log(body)
        expect(error).to.eql(null);
        expect(!!sessionId).to.not.be.false;
        expect(!!bridgeId).to.not.be.false;
        expect(!!accessToken).to.not.be.false;
        expect(!!body).to.not.be.false;
        hue.setSessionId(sessionId);
        hue.setBridgeId(bridgeId);
        hue.setAccessToken(accessToken);
        done();
      });
    });
  });
});
