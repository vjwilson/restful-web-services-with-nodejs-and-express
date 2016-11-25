var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');

var app = require('../app.js');

Book = mongoose.model('Book');
var agent = request.agent(app);

describe('Book CRUD test', function() {
  it('should allow a book to be posted and return a read and _id', function(done) {
    var bookPost = {
      title: 'New Book',
      author: 'John Doe',
      genre: 'Fiction'
    };

    agent.post('/api/books')
      .send(bookPost)
      .expect(200)
      .end(function(err, results) {
        results.body.read.should.equal(false);
        results.body.should.have.property('_id');
        done();
      });
  });

  afterEach(function(done) {
    Book.remove().exec();
    done();
  });
});