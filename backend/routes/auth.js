var express = require('express');
var router = express.Router();
const passport = require('passport');
const GoogleStragey = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const url = keys.mongodbURL;
var MongoClient = require('mongodb').MongoClient;
var myDBO;

passport.use(
    new GoogleStragey({
        clientID: keys.googleClientID, //change later
        clientSecret: keys.googleClientSecret, //change later
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        console.log(accessToken); 
        MongoClient.connect(url, function(err, db) {
            if(err) throw err;
            myDBO = db.db("CookbookBase");
            myDBO.collection("users").findOne({}).then(user => {
                if(user){
                    done(null,user);
                }

            })
        })
    })
);

router.get('/google/callback', passport.authenticate('google'),(req, res) => {
    
    res.redirect('https://night-in-12.firebaseapp.com/');
});

router.get(
    '/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('https://night-in-12.firebaseapp.com/');
    }
);

module.exports = router;