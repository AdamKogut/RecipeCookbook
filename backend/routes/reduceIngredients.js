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
});

router.post('/', function(req, res, next) {
  let user = req.body.googleId;
  let ingredients = req.body.ingredients;  //this should just be the extendIngredients array from a recipe's info with at least name and amount fields

  let results = myDBO.collection("users").find({googleId: user}, { projection: { onhandIngredients: 1, _id: 0}});
  results.toArray(function(err, result){
    if(err)
      throw err;
    let onHandResults = result[0].onhandIngredients;

    for(var i = 0; i < ingredients.length; i++){
      for(var j = 0; j < onHandResults.length; j++){
        if(ingredients[i].name === onHandResults[j].ingredient){
          let newAmount = onHandResults[j].quantity - ingredients[i].amount;
          if(newAmount > 0){
            myDBO.collection("users").updateOne({googleId: user, "onhandIngredients.ingredient": onHandResults[j].ingredient}, {$set: {"onhandIngredients.$.quantity": newAmount}});
          }else{
            myDBO.collection("users").updateOne({googleId: user}, {$pull: {onhandIngredients: {ingredient: onHandResults[j].ingredient}}});
          }
        }
      }
    }

    const resp = {
      success: true
    }
    res.json(resp);
  });
});

module.exports = router;
