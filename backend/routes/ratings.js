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

router.get('/', function(req,res,next){
  const resp = {
    success: true
  };

  res.json(resp);
})

router.post('/', function(req,res,next){
  const user = req.header("googleId");
  let result = myDBO.collection("users").findOne({googleId: user}, function(err, document){
    if(err){
      Console.log(err);
    }
    else if(document && document.ratings){ //document found with ratings field
      var ratings = document.ratings;
      var recipeId = req.header("recipeId");
      var rating = req.header("rating");
      obj = {
        recipeId: rating,
      }
      ratings.push(obj);
      myDBO.collection("users").updateOne({googleId: user}, {ratings: ratings}, function(err, res){
        if(err){
          const resp = {
            success: false
          };
      
          res.json(resp);
          console.log("Error updating ratings\n");
        }
        else{
          const resp = {
            success: true
          };
      
          res.json(resp);
          console.log("Ratings updated\n");
        }
      })
  }
  else{
      if(document){ //document found without ratings field
        var recipeId = req.header("recipeId");
        var rating = req.header("rating");
        obj = {
          recipeId: rating,
        }
        var ratings = [obj];
        myDBO.collection("users").updateOne({googleId: user}, {ratings: ratings}, function(err, res){
          if(err){
            const resp = {
              success: false
            };
            
            res.json(resp);
            console.log("Error updating ratings\n");
          }
          else{
            const resp = {
              success: true
            };
      
            res.json(resp);
            console.log("Ratings updated\n");
          }
        })
      }
      else{
        const resp = {
          success: false
        };
    
        res.json(resp);
        console.log("User does not exist\n");
      }
    }
  })
})

module.exports = router;