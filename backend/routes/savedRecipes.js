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
  //console.log("Databse obj is " + myDBO);
});

router.get('/', function(req, res, next) {
  const name = req.header("googleId");

  console.log(name);

  let result = myDBO.collection("users").find({googleId: name});

  result.toArray(function(err, result) {
    if (err) throw err;

    console.log(result);

    res.json(result);
  });
});

router.post('/', function(req, res, next) {
  const recipe = req.body.recipe; //send only the recipe to be added
  const user = req.body.googleId;

  let result = myDBO.collection("users").find({googleId: user});
  let flag = true;

  result.toArray(function(err, result) {
    if (err) throw err;

    for(let i = 0; i < result[0].recipes.length; i++) {
      if(result[0].recipes[i].id === recipe.id) {
        flag = false;
      }
    }

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

module.exports = router;
