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
    const id = req.header("id"); //REQUIRED
    //id of the recipe being looked up
    const includeNutrition = req.header("includeNutrition"); //should probably be true
    //Include nutrition data to the recipe information. Nutrition data is per serving. If you want the nutrition data for the entire recipe, just multiply by the number of servings.

    let url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/";

    if(id) {
      url += id + '/information';
    }
    if(includeNutrition) {
      url += '?includeNutrition=' + includeNutrition;
    }

    unirest.get(url)
    .header("X-RapidAPI-Key", keys.spoonacularKey) //MAJOR KEY ALERT
    .end(function (result) {
    console.log(result.status, result.headers, result.body);
    const resp = {
      status: result.status,
      header: result.headers,
      body: result.body
    };
    res.json(resp);
    });
});

module.exports = router;
