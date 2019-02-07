var express = require('express');
var router = express.Router();
var unirest = require('unirest');

const url = "mongodb+srv://NightInUser:NightIn@mycluster-ir6tr.mongodb.net/test?retryWrites=true"
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  console.log("Databse obj is " + myDBO);
});

router.post('/', function(req, res, next){
  console.log(req.body);
  //BOOLEAN (true or false): Whether the recipes should have an open license that allows for displaying with proper attribution.
  let limitLicense = req.body.limitLicense;
  //Tags that the random recipe(s) must adhere to (i.e. vegetarian,dessert)
  let tags = req.body.tags;

  let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=20";

  if(limitLicense){
    url += '&limitLicense=' + limitLicense
  }

  if(tags){
    tags.toLowerCase();
    tags = tags.replace(/\s/g, '');
    let tagsArray = tags.split(',');
    url += '&tags=';
    for(let i = 0; i < tagsArray.length - 1; i++){
      url += tagsArray[i] + '%2C'
    }
    url += tagsArray[tagsArray.length - 1];
  }
  console.log(url);

  unirest.get(url)
  .header("X-RapidAPI-Key", "65cccbe42amshc14dcee9ef31452p173356jsn8b5b8d2c1789") //MAJOR KEY ALERT
  .end(function (result) {
    //console.log(result.status, result.headers, result.body);
    const resp = {
      status: result.status,
      header: result.headers,
      body: result.body
  };

  res.json(resp);
  });
});

module.exports = router;
