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
  console.log("Databse obj is " + myDBO);
});

router.get('/', function(req, res, next){
  const user = req.header("googleId");
  let result = myDBO.collection("users").find({googleId: user}, { projection: { notes: 1 }});
  result.toArray(function(err, result){
    if (err) throw err;

    console.log(result);

    res.json(result);
  });
});

router.post('/', function(req, res, next){
  let user = req.body.googleId;
  let recipe = req.body.recipeID;
  let note = req.body.note;

  myDBO.collection("users").updateOne({googleId: user}, {$push: {"notes": {"recipeID": recipe, "note": note}}});

  const resp = {
    success: true
  };
  res.json(resp);
});
module.exports = router;
