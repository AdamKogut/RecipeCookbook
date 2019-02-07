require('babel-register')({
    presets: ['env']
});

const GoogleStragey = require('passport-google-oauth20').Strategy;

var http = require('http');
var path = require('path');
var fs = require('fs');
var express = require('express');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var unirest = require('unirest');

var bodyParser = require('body-parser');

var app = express();

passport.use(
    new GoogleStragey({
        clientID: "CLIENT", //change later
        clientSecret: "SECRET", //change later
        calbackURL: '/auth/google/callback'
    }, (accessToken) => {
        console.log(accessToken); 
    })
);

var helloRouter = require('./routes/hello');
var searchRouter = require('./routes/search');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '10gb' }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true }))


app.use('/hello', helloRouter);
app.use('/search', searchRouter);

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
