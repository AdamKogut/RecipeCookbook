var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/google/callback', passport.authenticate('google'),(req, res) => {
    //console.log(req.user);
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
    //console.log(req.user);
    res.send(req.user);
});

module.exports = router;