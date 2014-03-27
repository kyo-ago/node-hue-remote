var HueRemote = require('../lib/HueRemote');

describe('HueRemote', function () {
  var account = {
      'email': '',
      'password': ''
  };
  var bridgeid = '';
  var initializeParameter = {
    'devicetype' : 'Huedevicetype',
    'username' : 'newdeveloper'
  };

  before(function () {
    sinon
      .stub(request, 'get')
      .yields(null, null, JSON.stringify({login: "bulkan"}))
    ;
    sinon
      .stub(request, 'post')
      .yields(null, null, JSON.stringify({login: "bulkan"}))
    ;
  });

  after(function () {
    request.get.restore();
    request.post.restore();
  });

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
      this.timeout(15000);
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
      this.timeout(15000);
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
  // describe('getStatus', function () {
  //   it('should successfl', function (done) {
  //     var hue = new HueRemote({
  //       'account' : account,
  //       'bridgeid' : bridgeid
  //     });
  //     hue.getStatus(function (error, response, body) {
  //       console.log(arguments.length)
  //       expect(null).to.eql(null);
  //       done();
  //     });
  //   });
  // });
      // getAccessToken(account, bridgeid, function (accessToken, sessionId) {
      //   // getStatus(accessToken, bridgeid, function (error, response, body) {
      //   //   console.log(body)
      //   // });
      //   sendCommand(accessToken, sessionId, bridgeid, {
      //     'url' : '/api/0/api',
      //     'method' : 'POST',
      //     'body' : initializeParameter
      //   }, function (error, response, body) {
      //     sendCommand(accessToken, sessionId, bridgeid, {
      //       'url' : '/api/0/lights/3/state',
      //       'method' : 'PUT',
      //       'body' : {
      //         'on' : true
      //       }
      //     }, function (error, response, body) {
      //       console.log(body);
      //     });
      //   });
      // });
});
