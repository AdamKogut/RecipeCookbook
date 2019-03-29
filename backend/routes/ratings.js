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

router.get('/', function(req,res,next){
  console.log("GETTING");
  const user = req.body.googleId;
  myDBO.collection("users").findOne({googleId: user}, {projection: {ratings: 1}}, function(err, document){
    if(err){
      console.log(err);
    }
    else if(document){
      console.log(document);
      const resp = {
        success: true
      };

      res.json(resp);
    }
    else{
      const resp = {
        success: false,
      };

      res.json(resp);
    }
  })

})

router.post('/', function(req,res,next){
  //console.log(req.query.googleId);
  const user = req.body.googleId;;
  //console.log(user);
  myDBO.collection("users").findOne({googleId: user}, function(err, document){
    //console.log(document);
    if(err){
      Console.log("Error Finding User");
    }
    else if(document && document.ratings){ //document found with ratings field
      //console.log(document);
      var ratings = document.ratings;
      var recipeId = req.body.recipeId;
      var rating = req.body.rating;
      var first = req.body.first;
      //console.log(obj);
      var obj;
      ratings[recipeId]=rating;
      if(first){
        obj = {$set: {ratings: ratings}};
      }
      else{
        obj = {$setOnInsert: {ratings: ratings}};
      }
      
      console.log(ratings);
      
      myDBO.collection("users").updateOne({googleId: user},obj, function(err, result){
        if(err){
          const resp = {
            success: false
          };
          console.log("Error updating ratings\n");
          res.json(resp);

        }
        else{
          const resp = {
            success: true
          };
          console.log("Ratings updated\n");
          res.json(resp);

        }
      })
  }
  else{
      if(document){ //document found without ratings field
        var recipeId = req.body.recipeId;
        var rating = req.body.rating;
        console.log(recipeId);
        console.log(rating);
        console.log("VALUES PRINTED");
        var ratings = new Object;
        ratings[recipeId] = rating;
        myDBO.collection("users").updateOne({googleId: user},{$set: {ratings: ratings}}, function(err, result){
          if(err){
            const resp = {
              success: false
            };
            console.log("Error updating ratings\n");
            res.json(resp);

          }
          else{
            const resp = {
              success: true
            };
            console.log("Ratings updated\n");
            res.json(resp);
          }
        })
      }
      else{
        const resp = {
          success: false
        };
        console.log("User does not exist\n");
        res.json(resp);

      }
    }
  })
})

module.exports = router;
