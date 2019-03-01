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

  /* PLEASE SEND ALL FIELDS AS STRINGS */

  let user = req.body.googleId;

  let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=16&';

  let onHandResults = myDBO.collection("users").find({googleId: user}, { projection: { onhandIngredients: 1, _id: 0}});
  onHandResults.toArray(function(err, result){
    if(err)
      throw err;
    //console.log(result[0]);
    let onHandIng = result[0];
    if(onHandIng.onhandIngredients.length > 0){
      url += 'ingredients=';

      var i;
      for(i = 0; i < onHandIng.onhandIngredients.length - 1; i++){
        url += onHandIng.onhandIngredients[i].ingredient + '%2C';
        //console.log(onHandIng.onhandIngredients[i].ingredient)
      }

      url += onHandIng.onhandIngredients[i].ingredient;
      //console.log(onHandIng.onhandIngredients[i]);
    }
    console.log(url);
    unirest.get(url)
    .header("X-RapidAPI-Key", keys.spoonacularKey2) //MAJOR KEY ALERT
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
});

function cleanQuery(query){
  var cleanedQuery = query.replace(/[!@#$%^&*()_+\-=|\\\[\]"':;`~<>?,./☼¶§æÆ¢☺£¥₧ƒªº¿¬½¼¡«»ßµ±°∙·²€◙☻♥♦♣♠•◘○◙]/gi, '')
  return cleanedQuery;
}
module.exports = router;
