var express = require('express');
var router = express.Router();

/* GET test. */
router.get('/', function(req, res, next) {
  const url = "mongodb+srv://NightInUser:NightIn@mycluster-ir6tr.mongodb.net/test?retryWrites=true"
  var MongoClient = require('mongodb').MongoClient;
  var myDBO;

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err) throw err
    console.log("Database opened!");
    myDBO = db.db("CookbookBase");
    console.log("Databse obj is " + myDBO);
  });

    const resp = {
        message: "hello world!",
        arbitraryData: "123456",
        whatever: "blah"
    };

    res.json(resp);
});

router.post('/', function(req, res, next) {
  const url = "mongodb+srv://NightInUser:NightIn@mycluster-ir6tr.mongodb.net/test?retryWrites=true"
  var MongoClient = require('mongodb').MongoClient;
  var myDBO;

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err) throw err
    console.log("Database opened!");
    myDBO = db.db("CookbookBase");
    console.log("Databse obj is " + myDBO);

    console.log(req.body);

    const name = req.body.name;

    const user = {
      name: name
    };
    myDBO.collection("users").insertOne(user);
  });

    const resp = {
      success: true
    };
    res.json(resp);
});

module.exports = router;
