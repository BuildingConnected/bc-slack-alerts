var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000))

app.get('/', function(req, res) {
  res.send('You got it.');
});

app.post('/', function(req, res) {
  console.log(req);
});

var server = app.listen(app.get('port'));
