
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send("Carrez app");
});

app.listen(3000, function () {
  console.log('Carrez app available on http://localhost:3000 !');
});

