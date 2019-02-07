var express = require('express');
var router = express.Router();
var unirest = require('unirest');

//import axios from "axios";

const url = "mongodb+srv://NightInUser:NightIn@mycluster-ir6tr.mongodb.net/test?retryWrites=true"
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  //console.log("Databse obj is " + myDBO);
});

router.post('/', function(req, res, next) {

  /* PLEASE SEND ALL FIELDS AS STRINGS */

  let cuisine = req.body.cuisine; //MUST BE COMMA SEPERATED LIST IF MORE THAN ONE
  //CUSINE OPTIONS: african, chinese, japanese, korean, vietnamese, thai, indian, british, irish, french, italian, mexican, spanish, middle eastern, jewish, american, cajun, southern, greek, german, nordic, eastern european, caribbean, or latin american.
  let diet = req.body.diet;
  //POSSIBLE DIET OPTIONS: pescetarian, lacto vegetarian, ovo vegetarian, vegan, and vegetarian. maybe more?
  let includeIngredients = req.body.includeIngredients; //MUST BE COMMA SEPERATED LIST IF MORE THAN ONE
  //list of ingredients or ingredient types that should/must be contained in the recipes.
  let excludeIngredients = req.body.excludeIngredients; //MUST BE COMMA SEPERATED LIST IF MORE THAN ONE
  //list of ingredients or ingredient types that must not be contained in the recipes.
  let intolerances = req.body.intolerances; //MUST BE COMMA SEPERATED LIST IF MORE THAN ONE
  //All found recipes must not have ingredients that could cause problems for people with one of the given tolerances.
  let number = req.body.number; //REQUIRED
  //The number of results to return (between 0 and 100). defeault 10
  let offset = req.body.offset; //REQUIRED
  //The number of results to skip (between 0 and 900). default 0
  let type = req.body.type;
  //TYPE OPTIONS: main course, side dish, dessert, appetizer, salad, bread, breakfast, soup, beverage, sauce, or drink.
  let limitLicense = req.body.limitLicense; //REQUIRED
  //BOOLEAN (true or false): Whether the recipes should have an open license that allows for displaying with proper attribution.
  let instructionsRequired = req.body.instructionsRequired;
  //BOOLEAN (true or false): Whether the recipes must have instructions.
  let query = req.body.query;

  let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/searchComplex?';

  if(query) {
    url += 'query=' + query + '&';
  }
  if(cuisine) {
    cuisine = cuisine.replace(/\s/g, '');
    let cuisineArr = cuisine.split(',');
    if(cuisineArr.length > 1) {
      url += 'cuisine=';
      for(var i = 0; i < cuisineArr.length - 1; i++) {
        url += cuisineArr[i] + '%2C'
      }
      url += cuisineArr[i] + '&';
    }
    else {
      url += 'cuisine=' + cuisineArr[0] + '&';
    }
  }

  if(diet) {
    url += 'diet=' + diet + '&';
  }

  if(includeIngredients) {
    includeIngredients = includeIngredients.replace(/\s/g, '');
    let ingredientsArr = includeIngredients.split(",");
    if(ingredientsArr.length > 1) {
      url += 'excludeIngredients=';
      for(var i = 0; i < ingredientsArr.length - 1; i++) {
        url += ingredientsArr[i] + '%2C'
      }
      url += ingredientsArr[i] + '&';
    }
    else {
      url += 'includeIngredients=' + ingredientsArr[0] + '&';
    }
  }

  if(excludeIngredients) {
    excludeIngredients = excludeIngredients.replace(/\s/g, '');
    let ingredientsArr = excludeIngredients.split(",");
    console.log(ingredientsArr.length);
    console.log(ingredientsArr);
    if(ingredientsArr.length > 1) {
      url += 'excludeIngredients=';
      for(var i = 0; i < ingredientsArr.length - 1; i++) {
        url += ingredientsArr[i] + '%2C'
      }
      url += ingredientsArr[i] + '&';
    }
    else {
      url += 'excludeIngredients=' + ingredientsArr[0] + '&';
    }
  }

  if(intolerances) {
    intolerances = intolerances.replace(/\s/g, '');
    let intolerancesArr = intolerances.split(",");
    if(intolerancesArr.length > 1) {
      url += 'intolerances=';
      for(var i = 0; i < intolerancesArr.length - 1; i++) {
        url += intolerancesArr[i] + '%2C'
      }
      url += intolerancesArr[i] + '&';
    }
    else {
      url += 'intolerances=' + intolerancesArr[0] + '&';
    }
  }

  if(type) {
    url += 'type=' + type + '&';
  }

  if(instructionsRequired) {
    url += 'instructionsRequired=' + instructionsRequired + '&';
  }

  if(limitLicense) {
    url += 'limitLicense=' + limitLicense + '&';
  }

  if(offset) {
    url += 'offset=' + offset + '&';
  }

  if(number) {
    url += 'number=' + number;
  }

  console.log(url);

  unirest.get(url)
  .header("X-RapidAPI-Key", "API KEY GOES IN THESE QUOTES") //MAJOR KEY ALERT
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
