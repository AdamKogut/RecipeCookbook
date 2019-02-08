var express = require('express');
var router = express.Router();
const passport = require('passport');
const GoogleStragey = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const url = keys.mongodbURL;


passport.serializeUser((user,done) => {
    done(null, user.id); 
});

passport.deserializeUser((id ,done) => {
    User.findById(id)
    .then(user => {
        done(null, user);
    }).catch(err => {
        console.log(err);
    });
});



passport.use(
    new GoogleStragey({
        clientID: keys.googleClientID, //change later
        clientSecret: keys.googleClientSecret, //change later
        callbackURL: '/auth/google/callback'
    }, 
    (accessToken, refreshToken, profile, done) => {
        console.log(accessToken);
        //console.log(profile);
        User.findOne({googleId: profile.id})
        .then( (user) => {
            if(user){
                done(null, user);
            }
            else{
                new User({googleId: profile.id})
                .save()
                .then( (newUser) => done(null, newUser))
                .catch(err => console.log(err));     
            }

        })
        .catch(err => console.log(err));
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
        //res.send(req.user);
        res.redirect('https://night-in-12.firebaseapp.com/');
    }
);

router.get('/current_user', (req, res) => {
    res.send(req.user);
});

module.exports = router;