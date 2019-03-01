var express = require('express');
var router = express.Router();
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

router.get('/month', function(req, res, next) {
  const user = req.header("googleId");
  const date = req.header("udate");
  myDBO.collection("users").findOne({googleId: user},{ projection: { mealPlans: 1 }}, function(err, document){
    if(err){
      const resp = {
        success: false,
      };
      console.log("Error finding user");
      res.json(resp);
    }
    var splitDate = date.split('/');
    var month = parseInt(splitDate[0]);
    var day = 1;
    var year = parseInt(splitDate[2]);
    var plans = [];
    if(document.mealPlans){
      while(day<=31){
        var checkDate = month+"/"+day+"/"+year;
        if(!(document.mealPlans[checkDate] == null )){
          var obj = {};
          obj[checkDate] = document.mealPlans[checkDate];
          plans.push(obj);
        }
        day++;
      }
    }
    const resp = {
      mealPlans : plans,
      success : true,
    };
    console.log("Returning found meal plans");
    res.json(resp);
  });
});

router.get('/day', function(req, res, next) {
  const user = req.header("googleId");
  const date = req.header("udate");
  myDBO.collection("users").findOne({googleId: user},{ projection: { mealPlans: 1 }}, function(err, document){
    if(err){
      const resp = {
        success: false,
      };
      console.log("Error finding user");
      res.json(resp);
    }
    var plans = [];
    if(document.mealPlans){
        if(!(document.mealPlans[date] == null )){
          var obj = {};
          obj[date] = document.mealPlans[date];
          plans.push(obj);
        }
    }
    else {
      const resp = {
        success : false,
      }
    }
    const resp = {
      mealPlans : plans,
      success : true,
    };
    console.log("Returning found meal plans");
    res.json(resp);
  });
});

router.post('/', function(req, res, next) {
  const user = req.body.googleId;
  const date = req.body.date;
  const meal = req.body.meal;
  const recipeId = req.body.recipeId;
  const recipeName = req.body.recipeName;
  myDBO.collection("users").findOne({googleId: user},{ projection: { mealPlans: 1 }}, function(err, document){
    if(err){
      const resp = {
        success: false,
      };
      console.log("Error finding user");
      res.json(resp);
    }
    console.log(document.mealPlans[date]);
    if(document.mealPlans && document.mealPlans[date]){ //if document has a plan for that particular date
      var mealPlans = document.mealPlans;
      var meals = document.mealPlans[date]; //get meals object for that date
      var recipes = meals[meal]; //get recipes for particular meal from meal object
      var recipeobj = {
        recipeId : recipeId,
        recipeName: recipeName,
        meal: meal,
      }
      recipes.push(recipeobj); //update recipes for that meal
      meals[meal]=recipes; //update meal with updated recipes
      var obj = {};
      mealPlans[date] = meals;
      myDBO.collection("users").updateOne({googleId: user},{$set: {mealPlans: mealPlans}}, function(err, result){
        if(err){
          const resp = {
            success: false,
          };
          console.log("Error Updating recipes in plan");
          res.json(resp);
        }
        const resp = {
          success: true,
        };
        console.log("Recipes for meal updated");
        res.json(resp);
      });
    }
    else if(document){ //create plan for that particular date
      var mealPlans;
      if(document.mealPlans){
        mealPlans = document.mealPlans;
      }
      else{
        mealPlans = {};
      }
      var meals = {}; //make new meals object
      meals["Breakfast"]=[]; //set meal fields in meals obj with empty arrays for values
      meals["Lunch"]=[];
      meals["Dinner"]=[];
      var recipes = meals[meal]; //get empty array from above initialization
      var recipeobj = {
        recipeId : recipeId,
        recipeName: recipeName,
        meal: meal,
      }
      recipes.push(recipeobj); //push new recipe ID onto the desired meal
      var obj = {};
      mealPlans[date] = meals; //create new object with date as field and meals object as value
      myDBO.collection("users").updateOne({googleId: user},{$set: {mealPlans: mealPlans}}, function(err, result){
        if(err){
          const resp = {
            success: false,
          };
          console.log("Error Updating recipes in plan");
          res.json(resp);
        }
        const resp = {
          success: true,
        };
        console.log("Recipes for meal updated");
        res.json(resp);
      });
    }
  });
});

router.post('/delete', function(req,res,next){
  const user = req.body.googleId;
  const date = req.body.date;
  const meal = req.body.meal;
  const recipeId = req.body.recipeId;
  myDBO.collection("users").findOne({googleId: user},{ projection: { mealPlans: 1 }}, function(err, document){
    if(err){
      const resp = {
        success: false,
      };
      console.log("Error finding user");
      res.json(resp);
    }
    if(document.mealPlans && document.mealPlans[date]){ //if document has a plan for that particular date
      var meals = document.mealPlans[date]; //get meals object for that date
      var recipes = meals[meal]; //get recipes for particular meal from meal object
      for(var i=0; i < recipes.length; i++){
        if(recipes[i].recipeId == recipeId){
          recipes.splice(i,1);
        }
      }
      meals[meal] = recipes;
      var setobj = {};
      var obj = {};
      if(meals["Breakfast"].length == 0 && meals["Lunch"].length == 0 && meals["Dinner"].length == 0){
        delete document.mealPlans[date];
        setobj = {$set: {mealPlans: document.mealPlans}}
      }
      else{ 
        obj[date] = meals;
        setobj = {$set: {mealPlans: obj}};
      }
      
      myDBO.collection("users").updateOne({googleId: user},setobj, function(err, result){
        if(err){
          const resp = {
            success: false,
          };
          console.log("Error Updating recipes in plan");
          res.json(resp);
        }
        const resp = {
          success: true,
        };
        console.log("Recipes for meal updated");
        res.json(resp);
      });
    }
  });
});

module.exports = router;