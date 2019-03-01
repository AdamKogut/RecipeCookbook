var express = require('express');
var router = express.Router();
var unirest = require('unirest');

const url = "mongodb+srv://NightInUser:NightIn@mycluster-ir6tr.mongodb.net/test?retryWrites=true"
var MongoClient = require('mongodb').MongoClient;
var myDBO;

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if(err) throw err
  //console.log("Database opened!");
  myDBO = db.db("CookbookBase");
  //console.log("Databse obj is " + myDBO);
});

router.post('/', function(req, res, next) {
  const title = req.body.title; //id of list to be deleted
  const name = req.body.googleId; //username

  myDBO.collection("users").updateOne({ googleId: name }, { $pull: { groceryLists: { title: title } } });

  const resp = {
    success: true
  };
  res.json(resp);
});

module.exports = router;
