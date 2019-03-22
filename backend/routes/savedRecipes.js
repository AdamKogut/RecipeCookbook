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

router.get('/', function(req, res, next) {
  const name = req.header("googleId");
  const sort = req.header("sort");
  let result = myDBO.collection("users").find({googleId: name});

  result.toArray(function(err, result) {
    if (err) throw err;
    var savedRecipes = result[0].recipes;
    if(typeof savedRecipes == undefined || savedRecipes == null){
      const resp = {
        success: false,
      };
      console.log("savedRecipes");
      res.json(resp);
    }
    for(var i = 0; i<savedRecipes.length; i++){
      var ratings = result[0].ratings;
      if(typeof ratings == undefined || ratings == null){
        const resp = {
          success: false,
        };
        console.log("ratings");
        res.json(resp);
      }

      var rating = ratings[savedRecipes[i].id];
      var noratings = [];
      if(typeof rating == undefined || rating == null){
        continue;
      }
      else{
        savedRecipes[i].rating = rating;
      }
    }
    if(typeof sort == undefined || sort == null){
      res.json(savedRecipes);
    }
    else if(sort == "ascending"){
      savedRecipes.sort(ascend);
      res.json(savedRecipes);
    }
    else{
      savedRecipes.sort(descend);
      res.json(savedRecipes);
    }
  });
});

router.post('/', function(req, res, next) {
  const recipe = req.body.recipe; //send only the recipe to be added
  const user = req.body.googleId;

  let result = myDBO.collection("users").find({googleId: user});
  let flag = true;

  result.toArray(function(err, result) {
    if (err) throw err;

    if(flag) {
      myDBO.collection("users").updateOne({googleId: user}, {$push:{"recipes": recipe}}, () => {
        const resp = {
          success: true
        };

        res.json(resp);
      });
    } else {
      const resp = {
        success: false
      };

      res.json(resp);
    }
  });
});

function ascend(a,b){
  if(a.rating < b.rating){
    return -1;
  }
  else if(a.rating > b.rating){
    return 1;
  }
  else{
    return 0;
  }
}

function descend(a,b){
  if(a.rating < b.rating){
    return 1;
  }
  else if(a.rating > b.rating){
    return -1;
  }
  else{
    return 0;
  }
}

module.exports = router;
