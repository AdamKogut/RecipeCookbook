var express = require('express');
var router = express.Router();
var unirest = require('unirest');

const url = "mongodb+srv://NightInUser:NightIn@mycluster-ir6tr.mongodb.net/test?retryWrites=true"
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  //console.log("Databse obj is " + myDBO);
});

router.get('/', function(req, res, next) {
  const name = req.header("name");

  console.log(name);

  let result = myDBO.collection("users").find({name: name}, "recipes");

  result.toArray(function(err, result) {
  if (err) throw err;

  console.log(result);

  res.json(result);
  });
});

router.post('/', function(req, res, next) {
  const recipe = req.body.recipe; //send only the recipe to be added
  const user = req.body.user;

  console.log(recipe);

  let recipesArr = myDBO.collection("users").find({name: user}, "recipes");
  let flag = true;

  for(let i = 0; i < recipesArr.length; i++) {
    if(recipesArr[i].id == recipe.id) {
      flag = false;
    }
  }

  if(flag) {
    myDBO.collection("users").updateOne({name: user}, {$push:{"recipes": recipe}});
  }

  const resp = {
    success: true
  };
  res.json(resp);
});

module.exports = router;
