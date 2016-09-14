var firebase = require('../lib/firebase');

var server;

beforeEach(function() {
  server = firebase.createServer();
  firebase.deleteToken();
});

afterEach(function () {
  firebase.deleteToken();
  if (server) {
    server.close();
    server = null;
  }
});

