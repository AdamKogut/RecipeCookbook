const passport = require('passport');
const GoogleStragey = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');

passport.use(
    new GoogleStragey({
        clientID: keys.googleClientID, //change later
        clientSecret: keys.googleClientSecret, //change later
        callbackURL: '/auth/google/callback'
    }, 
    (accessToken, refreshToken, profile, done) => {
        console.log(typeof(profile.id));
        //console.log(accessToken);
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
