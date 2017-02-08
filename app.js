
var express = require('express');
var app = express();
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var bodyparser = require('body-parser');
app.use("/Style", express.static( __dirname + '/Style'));
app.use("/Js", express.static( __dirname + '/Js'));

app.get('/', function (req, res) {
  res.sendfile( __dirname + "/Templates/Accueil.html");
});
app.get('/Accueil', function (req,res) {
  res.sendfile( __dirname + "/Templates/Accueil.html");
});
app.get('/Calculate', function (req, res) {
  res.sendfile( __dirname + "/Templates/Calculate.html");
});
app.listen(3000, function () {
  console.log('Carrez app available on http://localhost:3000 !');
});
