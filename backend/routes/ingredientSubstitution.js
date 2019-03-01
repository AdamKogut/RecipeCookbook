var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var keys = require('../config/keys');

//import axios from "axios";

const url = keys.mongodbURL;
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  //console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  //console.log("Databse obj is " + myDBO);
});

router.get('/', function(req, res, next) {
  const name = req.header("name"); //REQUIRED

  let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/substitutes?ingredientName=";
  url += name;

  unirest.get(url)
    .header("X-RapidAPI-Key", keys.spoonacularKey) //MAJOR KEY ALERT
    .end(function (result) {
      console.log(result.status, result.headers, result.body);
      const resp = {
        status: result.status,
        body: result.body
      };

      res.json(resp);
    });
});

module.exports = router;
