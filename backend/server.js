require('babel-register')({
    presets: ['env']
});


const GoogleStragey = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');

var express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

require('./models/user');
require('./services/passport');

mongoose.connect(keys.mongodbURL);

var app = express();

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey],
    })
);

app.use(passport.initialize());
app.use(passport.session());

var authRouter = require('./routes/auth');


var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var unirest = require('unirest');




app.use('/auth', authRouter);
//require('./routes/auth');

var bodyParser = require('body-parser');






var helloRouter = require('./routes/hello');
var searchRouter = require('./routes/search');
var recipeInfoRouter = require('./routes/recipeInfo');
var savedRecipesRouter = require('./routes/savedRecipes');
var deleteSavedRecipeRouter = require('./routes/deleteSavedRecipe');
var randomsearch = require('./routes/randomsearch');
var recipeNote = require('./routes/recipeNote');
var excludedIngredients = require('./routes/excludedIngredients');
var onhandIngredients = require('./routes/onhandIngredients');
var groceryLists = require('./routes/groceryLists');
var testRouter = require('./routes/test');
var mealRouter = require('./routes/meal');
var ratings = require('./routes/ratings');
var onhandSearch = require('./routes/onhandSearch');
var ingredientSubstitution = require('./routes/ingredientSubstitution');

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

app.use('/test', testRouter);
app.use('/meal', mealRouter);
app.use('/hello', helloRouter);
app.use('/search', searchRouter);
app.use('/recipeInfo', recipeInfoRouter);
app.use('/savedRecipes', savedRecipesRouter);
app.use('/deleteSavedRecipe', deleteSavedRecipeRouter);
app.use('/randomsearch', randomsearch);
app.use('/recipeNote', recipeNote);
app.use('/excludedIngredients', excludedIngredients);
app.use('/onhandIngredients', onhandIngredients);
app.use('/groceryLists', groceryLists);
app.use('/ratings', ratings);
app.use('/onhandSearch', onhandSearch);
app.use('/ingredientSubstitution', ingredientSubstitution);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('port', process.env.PORT || 8080);

app.use(function(req, res, next) {
    next(createError(404));
});

var httpServer = http.createServer(app);

//const fs = require('fs');
/*
const options = {
	key: fs.readFileSync('../../certificates/privkey.pem','utf8'),
	cert: fs.readFileSync('../../certificates/fullchain.pem','utf8')
};

var httpsServer = https.createServer(options, app);

httpsServer.listen(8000, function() {
    console.log('HTTPS server listening on port ' + app.get('port'));
});
*/
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
