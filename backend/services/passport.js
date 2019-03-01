const passport = require('passport');
const GoogleStragey = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');

passport.serializeUser((user,done) => {
    done(null, user.id);
});

passport.deserializeUser((id ,done) => {
    console.log("ID: "+id);
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
        console.log(typeof(profile.id));
        //console.log(accessToken);
        //console.log(profile);
        User.findOne({googleId: profile.id})
        .then( existingUser => {
            console.log("user retrieved\n" + existingUser)
            if(existingUser){
                done(null, existingUser);
            }
            else{
                new User({
                    googleId: profile.id,
                    name: profile.name.givenName,
                    diet: "",
                    recipes: [],
                    notes: [],
                    excludedIngredients: [],
                    mealPlans: {},
                    ratings: {},
                    onhandIngredients: [],
                    groceryLists: []
                })
                .save()
                .then( user => done(null, user))
                .catch(err => console.log(err));
            }

        })
        .catch(err => console.log(err));
    })
);
