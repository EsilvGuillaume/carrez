var express = require('express');
var app = express();
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var obj;
var obj2;
var url;
var nbresearch =0;
var resultboncoin;
var resultdeal;
var bodyparser = require('body-parser');
app.use("/JSON", express.static( __dirname + '/JSON'));
app.use("/Style", express.static( __dirname + '/Style'));
app.use("/Js", express.static( __dirname + '/Js'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//Lecture fichier json schema de base
fs.readFile( __dirname + '/JSON/boncoin.json', 'utf8', (err, data) => {
  if (err) throw err;
  obj = JSON.parse(data);
});
fs.readFile( __dirname + '/JSON/meilleuragent.json', 'utf8', (err, data) => {
  if (err) throw err;
  obj2 = JSON.parse(data);
});

//Demarrage serveur
app.listen(3000, function () {
  console.log('Carrez app available on http://localhost:3000 !');
});
//Chargement module leboncoin, et meilleuragent
var leboncoin = require('./JS/boncoinmod');
var meilleuragent = require('./JS/meilleuragentmod');


//Demarrage application
app.get('/', function (req, res) {
  res.render( __dirname + "/Templates/Calculate.ejs", {urlenter: "", result: ""});
});
//Fonctionnement request url post form
app.post('/', function (req, res){
 url = req.body.Url;
 if(nbresearch>0)
 {
delete require.cache[require.resolve( __dirname +'/JSON/boncoinoutput')];//Suppression du cache des anciens fichiers de résultat (lors de plusieurs requetes sur une meme session)
delete require.cache[require.resolve( __dirname +'/JSON/Agent_output')];
}
  var outputjsonboncoin ="";

  leboncoin.Scraper(url, obj);
setTimeout(function() {
 outputjsonboncoin = require( __dirname + '/JSON/boncoinoutput');
meilleuragent.Scraperinverse(outputjsonboncoin, obj2);
},2000);

setTimeout(function() {
var outputmeilleuragen = require ( __dirname +'/JSON/Agent_output');
nbresearch++;
res.render( __dirname + "/Templates/Calculate.ejs", {urlenter: url, result: outputmeilleuragen.properties.deal});
},7000);
});
