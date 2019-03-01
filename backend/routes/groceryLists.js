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
  const edit = req.body.edit;
  let lists = [];

  let result = myDBO.collection("users").find({googleId: user});
  result.toArray(function(err, result){
    if (err) throw err;

    lists = result[0].groceryLists;

    //console.log(lists);
    let exists = false;

    for(let i = 0; i < lists.length; i++) {
      if(lists[i].title == list.title) {
        exists = true;
      }
    }

    if(!edit && exists){
      const resp = {
        success: "Title must be unique"
      };

      res.json(resp);
    }
    else {
      if(edit) {
        myDBO.collection("users").updateOne({ googleId: user }, { $pull: { groceryLists: { title: list.title } } });
      }

      myDBO.collection("users").updateOne({googleId: user}, {$push:{"groceryLists": list}}, () => {
        const resp = {
          success: true
        };

        res.json(resp);
      });
    }
  });
});

module.exports = router;
