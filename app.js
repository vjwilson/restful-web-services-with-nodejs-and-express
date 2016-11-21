var express = require('express');

var app = express();

var bookRouter = express.Router();

bookRouter.route('/books')
.get(function(req, res) {
  var responseJson = {
    id: 69,
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien'
  };

  res.json(responseJson);
});

app.use('/api', bookRouter);

var port = process.env.PORT || 4000;

app.get('/', function(req, res) {
  res.send('Welcome to my API');
});

app.listen(port, function() {
  console.log('Gulp is running my app on port ' + port);
});
