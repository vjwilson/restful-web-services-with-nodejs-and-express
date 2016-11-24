var express = require('express');

var routes = function(Book) {
  var bookRouter = express.Router();

  bookRouter.route('/')
    .post(function(req, res) {
      var book = new Book(req.body);
      book.save();

      res.status(201).send(book);
    })
    .get(function(req, res) {
      var query = {};

      if (req.query.author) {
        query.author = req.query.author;
      }
      if (req.query.genre) {
        query.genre = req.query.genre;
      }
      if (req.query.title) {
        query.title = req.query.title;
      }

      Book.find(query, function(err, books) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(books);
        }
      });
    });

  bookRouter.use('/:bookId', function(req, res, next) {
    Book.findById(req.params.bookId, function(err, book) {
      if (err) {
        res.status(500).send(err);
      } else if (book) {
        req.currentBook = book;
        next();
      } else {
        res.status(404).send('No book found');
      }
    });
  });

  bookRouter.route('/:bookId')
    .get(function(req, res) {
      res.json(req.currentBook);
    })
    .put(function(req, res) {
      req.currentBook.title = req.body.title;
      req.currentBook.author = req.body.author;
      req.currentBook.genre = req.body.genre;
      req.currentBook.read = req.body.read;

      req.currentBook.save(function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.currentBook);
        }
      });
    }).patch(function(req, res) {
      delete req.body._id; // guard against getting ID out-of-sync

      req.currentBook = Object.assign(req.currentBook, req.body);

      req.currentBook.save(function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(req.currentBook);
        }
      });
    }).delete(function(req, res) {
      req.currentBook.remove(function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(204);
        }
      });
    });

  return bookRouter;
}

module.exports = routes;
