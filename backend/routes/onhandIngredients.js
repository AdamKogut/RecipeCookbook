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

router.get('/', function(req, res, next){
  const user = req.header("googleId");
  let result = myDBO.collection("users").find({googleId: user}, { projection: { onhandIngredients: 1}});
  result.toArray(function(err, result){
    if(err)
      throw err;
    console.log(result);
    res.json(result);
  });
});

/*route to add ingredients to on hand array*/
router.post('/', function(req, res, next){
  let user = req.body.googleId;
  /*Send ingredients as such:
  [
    {
      ingredient: "tuna",
      quantity: 5,
      unit: "pounds",
      date: "date in whatever format idk"
    },
    ...
  ]*/
  let ingredients = req.body.ingredients;

  for(var i = 0; i < ingredients.length; i++){
    myDBO.collection("users").updateOne({googleId: user}, {$push: {"onhandIngredients": ingredients[i]}});
  }

  const resp = {
    success: true
  }
  res.json(resp);
});

/*route to delete a single ingredient from on hand array*/
router.delete('/', function(req, res, next){
  let user = req.body.googleId;
  let ingredient = req.body.ingredients.ingredient; //a single object that contains an ingredient
  myDBO.collection("users").updateOne({googleId: user}, {$pull: {onhandIngredients: {ingredient: ingredient}}});

  const resp = {
    success: true
  }
  res.json(resp);
});

/*route to UPDATE an ingredient*/
router.patch('/', function(req, res, next){
  let user = req.body.googleId;
  let ingredient = req.body.ingredients; //the full ingredient object with updated values

  myDBO.collection("users").updateOne({googleId: user, "onhandIngredients.ingredient": ingredient.ingredient}, {$set: {"onhandIngredients.$.quantity": ingredient.quantity, "onhandIngredients.$.unit": ingredient.unit, "onhandIngredients.$.date": ingredient.date}});

  const resp = {
    success: true
  }
  res.json(resp);
});

/*route to delete all ingredients from on hand array*/
router.purge('/', function(req, res, next){
  let user = req.body.googleId;
  myDBO.collection("users").updateOne({googleId: user}, {$set: {"onhandIngredients": []}});

  const resp = {
    success: true
  }
  res.json(resp);
});

module.exports = router;
