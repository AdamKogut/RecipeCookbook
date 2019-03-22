var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var keys = require('../config/keys');

const url = keys.mongodbURL;
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  //console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  //console.log("Databse obj is " + myDBO);
});

router.post('/', function(req, res, next) {
  const recipe = req.body.recipe; //send only the recipe to be multiplied
  const multiplier = req.body.multiplier; //amount the ingredients will be multiplied by

  let ingredients = recipe.extendedIngredients;

  for(let i = 0; i < ingredients.length; i++) {
    let amount = ingredients[i].amount;
    let original = ingredients[i].original;

    if(ingredients[i].unit !== "servings") {
      amount *= multiplier;
      original = amount.toString();

      if (ingredients[i].unit.length !== 0)
        original += " " + ingredients[i].unit;

      original += " " + ingredients[i].originalName;

      ingredients[i].original = original;
    }
  }

  recipe.extendedIngredients = ingredients;
  recipe.multipliedBy = multiplier;

  res.json(recipe);

});


module.exports = router;
