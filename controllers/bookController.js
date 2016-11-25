var bookController = function(Book) {
  var post = function(req, res) {
    if (!req.body.title) {
      res.status(400);
      res.send('Title is required');
    } else {
      var book = new Book(req.body);
      book.save(function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201);
          res.send(book);
        }
      });
    }
  };

  var get = function(req, res) {
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
        var hateosBooks = books.map(function(book) {
          var newBook = book.toJSON();
          newBook.links = {};
          newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
          return newBook;
        });
        res.json(hateosBooks);
      }
    });
  };

  return {
    post: post,
    get: get
  }
};

module.exports = bookController;