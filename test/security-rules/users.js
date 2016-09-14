var firebase = require('../../lib/firebase');
var expect = require('chai').expect;

describe('Security Rules - Users', function () {

  describe('non-logged user', function () {

    it('should not be able to get the users list', function (done) {
      var client = firebase.createClient();
      client.child('users').once('value', function (snap) {
        done(new Error('Client has read permission'));
      }, function (err) {
        expect(err.code).to.equal('PERMISSION_DENIED');
        done();
      });
    });

    it('should not be able to update an user', function (done) {
      var client = firebase.createClient();
      client.child('users/user1').set({ 'test': true })
        .then(function() {
          done(new Error('Client has write permission'));
        })
        .catch(function(err) {
          expect(err.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

    it('should not be able to delete an user', function (done) {
      var client = firebase.createClient();
      client.child('users/user1').set(null)
        .then(function() {
          done(new Error('Client has write permission'));
        })
        .catch(function(err) {
          expect(err.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

  });

  describe('logged user', function () {

    beforeEach(function(){
      // Login with uid "user1"
      firebase.createToken({uid: 'user1'});
    })

    it('should be able to get the users list', function (done) {
      var client = firebase.createClient();
      client.child('users').once('value', function (snap) {
        expect(snap.val()).to.not.equal(null);
        done();
      }, function (err) {
        done(new Error(err.code));
      });
    });

    it('should be able to update their profile', function (done) {
      var client = firebase.createClient();
      client.child('users/user1').set({ 'name': 'Test' })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(new Error(err.code));
        });
    });

    it('should not be able to set theirself as admin', function (done) {
      var client = firebase.createClient();
      client.child('users/user1').set({ 'admin': true })
        .then(function() {
          done(new Error('Client has write permission'));
        })
        .catch(function(err) {
          expect(err.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

    it('should not be able to update another\'s profile', function (done) {
      var client = firebase.createClient();
      client.child('users/user2').set({ 'name': 'Test' })
        .then(function() {
          done(new Error('Client has write permission'));
        })
        .catch(function(err) {
          expect(err.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

    it('should not be able to delete their profile', function (done) {
      var client = firebase.createClient();
      client.child('users/user1').set(null)
        .then(function() {
          done(new Error('Client has write permission'));
        })
        .catch(function(err) {
          expect(err.code).to.equal('PERMISSION_DENIED');
          done();
        });
    });

  });

});