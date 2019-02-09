var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var keys = require('../config/keys');

const url = keys.mongodbURL;
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  console.log("Databse obj is " + myDBO);
});

router.post('/', function(req, res, next){
  //BOOLEAN (true or false): Whether the recipes should have an open license that allows for displaying with proper attribution.
  let limitLicense = req.body.limitLicense;
  //Tags that the random recipe(s) must adhere to (i.e. vegetarian,dessert)
  let tags = req.body.tags;

  let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=" + req.body.number;

  if(limitLicense){
    url += '&limitLicense=' + limitLicense
  }

  if(tags){
    tags.toLowerCase();
    tags = tags.replace(/\s/g, '');
    let tagsArray = tags.split(',');
    url += '&tags=';

    let i;
    for(i = 0; i < tagsArray.length - 1; i++){
      url += tagsArray[i] + '%2C'
    }

    url += tagsArray[tagsArray.length - 1];
  }

  unirest.get(url)
  .header("X-RapidAPI-Key", keys.spoonacularKey) //MAJOR KEY ALERT
  .end(function (result) {
    const resp = {
      status: result.status,
      header: result.headers,
      body: result.body
    };

    res.json(resp);
  });
});

module.exports = router;
