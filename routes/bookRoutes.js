var express = require('express');

var routes = function(Book) {
  var bookRouter = express.Router();

  var bookController = require('../controllers/bookController')(Book);
console.log(bookController)

  bookRouter.route('/')
    .post(bookController.post)
    .get(bookController.get);

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
      var hateosBook = req.currentBook.toJSON();
      hateosBook.links = {};
      hateosBook.links.filterByThisGenre = encodeURI('http://' + req.headers.host + '/api/books/?genre=' + hateosBook.genre);
      res.json(hateosBook);
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
