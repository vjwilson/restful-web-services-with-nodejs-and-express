var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var db;
if (process.env.ENV === 'test') {
  db = mongoose.connect('mongodb://localhost/bookAPI_test');
} else {
  db = mongoose.connect('mongodb://localhost/bookAPI');
}

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Book = require('./models/bookModel');

var bookRouter = require('./routes/bookRoutes')(Book);

app.use('/api/books', bookRouter);

var port = process.env.PORT || 4000;

app.get('/', function(req, res) {
  res.send('Welcome to my API');
});

app.listen(port, function() {
  console.log('Gulp is running my app on port ' + port);
});

module.exports = app;
