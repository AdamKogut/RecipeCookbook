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
  let result = myDBO.collection("users").find({googleId: user}, { projection: { notes: 1 }});
  result.toArray(function(err, result){
    if (err) throw err;

    console.log(result);

    res.json(result);
  });
});

router.post('/', function(req, res, next){
  let user = req.body.googleId;
  let recipe = req.body.recipeId;
  let note = req.body.note;

  console.log(user, recipe, note);

  let result = myDBO.collection("users").find({googleId: user}, { projection: { notes: 1 }});
  result.toArray(function(err, result){
    let notes = result[0].notes;

    let found = false;
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].recipeId === recipe) {
        notes[i].note = note;
        found = true;
        break;
      }
    }

    if (!found) {
      notes.push({"recipeId": recipe, "note": note});
    }

    console.log(notes);

    myDBO.collection("users").updateOne({googleId: user}, {$set: {"notes": notes}}, () => {
      const resp = {
        success: true
      };
      res.json(resp);
    });
  });
});
module.exports = router;
