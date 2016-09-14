var originalWebsocket = require('faye-websocket');
var proxyquire = require('proxyquire');
var _ = require('lodash');

// Firebase has strict requirements about the hostname format. So we provide a dummy
// hostname and then change the URL to localhost inside the faye-websocket's Client
// constructor.
var firebase = proxyquire('firebase', {
  'faye-websocket': {
    Client: function (url) {
      url = url.replace(/dummy\d+\.firebaseio\.test/i, 'localhost');
      return new originalWebsocket.Client(url);
    },
    '@global': true
  }
});

// this is the auth token that will be sent to the server during tests.
// it is initialized in `beforeEach()`.
var authToken = null;

// Override Firebase client authentication mechanism. This allows us to set custom auth tokens during
// tests, as well as authenticate anonymously.
firebase.INTERNAL.factories.auth = function(app, extendApp) {
  var _listeners = [];
  var token = authToken;
  extendApp({
    'INTERNAL': {
      'getToken': function() {
        if (!token) {
          return Promise.resolve(null);
        }
        _listeners.forEach(function(listener) {
          listener(token);
        });
        return Promise.resolve({ accessToken: token, expirationTime: 1566618502074 });
      },
      'addAuthTokenListener': function(listener) {
        _listeners.push(listener);
      }
    }
  });
};

// Firebase client
var PORT = require("./config").port;
var sequentialConnectionId = 0;

exports.createClient = function() {
    var name = 'test-firebase-client-' + sequentialConnectionId;
    var url = 'ws://dummy' + (sequentialConnectionId++) + '.firebaseio.test:' + PORT;
    var config = {
      databaseURL: url,
      serviceAccount: {
        'private_key': 'fake',
        'client_email': 'fake'
      }
    };
    var app = firebase.initializeApp(config, name);
    return app.database().ref();
}

// Firebase server
var FirebaseServer = require('firebase-server');
var rules = require('../rules.json');
var data = require('../data.json');

exports.createServer = function(){
  firebaseServer = new FirebaseServer(PORT, 'localhost:' + PORT, data);
  firebaseServer.setRules(rules);
  return firebaseServer;
}

// Token generator
var TokenGenerator = require('firebase-token-generator');
var tokenGenerator = new TokenGenerator('goodSecret');

exports.createToken = function(token){
  authToken = tokenGenerator.createToken(token);
}

exports.deleteToken = function(){
  authToken = null;
}