require('babel-register')({
    presets: ['env']
});


const GoogleStragey = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
var http = require('http');
var path = require('path');
var fs = require('fs');

var express = require('express');
const mongoose = require('mongoose');
require('./models/User');
require('./services/passport');


mongoose.connect(keys.mongodbURL);

var app = express();

var authRouter = require('./routes/auth');
app.use('/auth', authRouter);

var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var unirest = require('unirest');



require('./routes/auth');

var bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');

app.use(   
    cookieSession({
        maxAge: 100,//30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

app.use(passport.initialize());
app.use(passport.session());

var helloRouter = require('./routes/hello');
var searchRouter = require('./routes/search');
var recipeInfoRouter = require('./routes/recipeInfo');
var savedRecipesRouter = require('./routes/savedRecipes');
var deleteSavedRecipeRouter = require('./routes/deleteSavedRecipe');
var randomsearch = require('./routes/randomsearch');
var recipeNote = require('./routes/recipeNote');
var excludedIngredients = require('./routes/excludedIngredients');


var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', '*');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10gb' }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true }))


app.use('/hello', helloRouter);
app.use('/search', searchRouter);
app.use('/recipeInfo', recipeInfoRouter);
app.use('/savedRecipes', savedRecipesRouter);
app.use('/deleteSavedRecipe', deleteSavedRecipeRouter);
app.use('/randomsearch', randomsearch);
app.use('/recipeNote', recipeNote);
app.use('/excludedIngredients', excludedIngredients);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('port', process.env.PORT || 8080);

app.use(function(req, res, next) {
    next(createError(404));
});

var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), function() {
    console.log('Server listing on port ' + app.get('port'));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
