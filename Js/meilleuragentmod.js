var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
exports.Scraperinverse = function(jsonboncoin, jsonresult)
{
  var url = "https://www.meilleursagents.com/prix-immobilier/"+jsonboncoin.properties.ville_postal;

  request({url: url, encoding: 'binary' }, function(error, response, html){
    if(!error)
    {
      	var $ = cheerio.load(html);
        jsonresult.properties.ville = $('.breadcrumbs > li:nth-child(4) > a:nth-child(1)').text();
        jsonresult.properties.Appartement.min = $('div.medium-uncollapse:nth-child(2) > div:nth-child(2)').text();
        jsonresult.properties.Appartement.min = jsonresult.properties.Appartement.min.replace(/\n/g, "");
        jsonresult.properties.Appartement.min = jsonresult.properties.Appartement.min.replace(/€/g, "");
        jsonresult.properties.Appartement.min = jsonresult.properties.Appartement.min.replace(/[^0-9]/g, "");

        jsonresult.properties.Appartement.max = $('div.medium-uncollapse:nth-child(2) > div:nth-child(4)').text();
        jsonresult.properties.Appartement.max = jsonresult.properties.Appartement.max.replace(/\n/g, "");
        jsonresult.properties.Appartement.max = jsonresult.properties.Appartement.max.replace(/€/g, "");
        jsonresult.properties.Appartement.max = jsonresult.properties.Appartement.max.replace(/[^0-9]/g, "");

        jsonresult.properties.Appartement.moy = $('div.medium-uncollapse:nth-child(2) > div:nth-child(3)').text();
        jsonresult.properties.Appartement.moy = jsonresult.properties.Appartement.moy.replace(/\n/g, "");
        jsonresult.properties.Appartement.moy = jsonresult.properties.Appartement.moy.replace(/€/g, "");
        jsonresult.properties.Appartement.moy = jsonresult.properties.Appartement.moy.replace(/[^0-9]/g, "");

        jsonresult.properties.Maison.min = $('div.medium-uncollapse:nth-child(3) > div:nth-child(2)').text();
        jsonresult.properties.Maison.min = jsonresult.properties.Maison.min.replace(/\n/g, "");
        jsonresult.properties.Maison.min = jsonresult.properties.Maison.min.replace(/€/g, "");
        jsonresult.properties.Maison.min = jsonresult.properties.Maison.min.replace(/[^0-9]/g, "");

        jsonresult.properties.Maison.max = $('div.medium-uncollapse:nth-child(3) > div:nth-child(4)').text();
        jsonresult.properties.Maison.max = jsonresult.properties.Maison.max.replace(/\n/g, "");
        jsonresult.properties.Maison.max = jsonresult.properties.Maison.max.replace(/€/g, "");
        jsonresult.properties.Maison.max = jsonresult.properties.Maison.max.replace(/[^0-9]/g, "");

        jsonresult.properties.Maison.moy = $('div.medium-uncollapse:nth-child(3) > div:nth-child(3)').text();
        jsonresult.properties.Maison.moy = jsonresult.properties.Maison.moy.replace(/\n/g, "");
        jsonresult.properties.Maison.moy = jsonresult.properties.Maison.moy.replace(/€/g, "");
        jsonresult.properties.Maison.moy = jsonresult.properties.Maison.moy.replace(/ /g, "");
        jsonresult.properties.Maison.moy = jsonresult.properties.Maison.moy.replace(/[^0-9]/g, "");





        if (jsonboncoin.properties.type == "Maison")
        {

            var price = jsonboncoin.properties.prix;
            var surface = jsonboncoin.properties.surface;
            if ((price/surface) > parseInt(jsonresult.properties.Maison.moy))
            {
              if( parseInt((price/surface)) > (parseInt(jsonresult.properties.Maison.moy) + ((parseInt(jsonresult.properties.Maison.max) - parseInt(jsonresult.properties.Maison.moy))/2)))
              {
                jsonresult.properties.deal = "Bad";
              }
              else {
                jsonresult.properties.deal = "Expensive";
              }
            }
            else
            {
              jsonresult.properties.deal = "Good";
              if(jsonresult.properties.Maison.moy == "")
              {
                jsonresult.properties.deal = "Error";
              }
            }
        }
        else
        {

          var price = jsonboncoin.properties.prix;
          var surface = jsonboncoin.properties.surface;
          if ( (price/surface) > parseInt(jsonresult.properties.Appartement.moy))
          {
            if( parseInt((price/surface)) > (parseInt(jsonresult.properties.Appartement.moy) + ((parseInt(jsonresult.properties.Appartement.max) - parseInt(jsonresult.properties.Appartement.moy))/2)))
            {
              jsonresult.properties.deal = "Bad";
            }
            else {
              jsonresult.properties.deal = "Expensive";
            }
          }
          else
          {
            jsonresult.properties.deal = "Good";
            if(parseInt(jsonresult.properties.Appartement.moy == ""))
            {
              jsonresult.properties.deal = "Error";
            }
          }
        }
        fs.writeFile('JSON/Agent_output.json', JSON.stringify(jsonresult, null, 4), function(err){
        });
    }
    else {
      {
        console.log("Error: " + error);
        jsonresult.properties.deal = "Error";
      }
    }
  })
}
