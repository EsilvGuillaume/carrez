var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

exports.Scraper = function(url, jsonempty)
{
  request({url: url, encoding: 'binary' }, function(error, response, html){
    if(!error)
    {
      var $ = cheerio.load(html, { decodeEntities: false });
      $('.item_price.clearfix').filter(function()
      {
        var data = $(this);
        jsonempty.properties.prix = data.attr('content');
      })
      var decalage =7;
      jsonempty.properties.ville_postal = $("div.line:nth-child(6) > h2:nth-child(1) > span:nth-child(2)").text();
      if ($('div.line:nth-child(7) > h2:nth-child(1) > span:nth-child(1)').text() == "Frais d'agence inclus")
      {
        decalage++;
      }
      jsonempty.properties.type = $('div.line:nth-child('+decalage+') > h2:nth-child(1) > span:nth-child(2)').text();
      decalage++;
      jsonempty.properties.piece = $('div.line:nth-child('+decalage+') > h2:nth-child(1) > span:nth-child(2)').text();
      decalage++;
      jsonempty.properties.surface = $('div.line:nth-child('+decalage+') > h2:nth-child(1) > span:nth-child(2)').text();
      var tmpville = jsonempty.properties.ville_postal.split("\n")
      jsonempty.properties.ville_postal = tmpville[0];
      var tmpville = tmpville[0].replace(/ /g, "-");
      jsonempty.properties.ville_postal = tmpville.toLowerCase();
      var surface = jsonempty.properties.surface.split(" ");
      jsonempty.properties.surface = surface[0];
fs.writeFile('JSON/boncoinoutput.json', JSON.stringify(jsonempty, null, 4), 'utf8', function (err){
})
}
else {
    console.log("Error: network" + error);
}
})
}
