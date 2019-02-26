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
  let result = myDBO.collection("users").find({googleId: user});
  result.toArray(function(err, result){
    if (err) throw err;

    console.log(result);
    const resp = {
      list: result[0].groceryLists
    };

    res.json(resp);
  });
});

router.post('/', function(req, res, next){
  let user = req.body.googleId;
  let list = req.body.list;

  myDBO.collection("users").updateOne({googleId: user}, {$push:{"groceryLists": list}}, () => {
    const resp = {
      success: true
    };

    res.json(resp);
  });
});

module.exports = router;
