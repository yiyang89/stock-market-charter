var express = require('express');
var app = express();
var fs = require('fs');
var passport = require('passport');
// Each type of passport plugin will require its specific oauth strategy.
var GoogleStrategy = require('passport-google-oauth20').Strategy;
// Need to create credentials on https://console.developers.google.com/
// MOVE THESE INTO ENV VARIABLES BEFORE DEPLOYING.
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://oauth-template-decky.herokuapp.com/auth/google/callback",
    // callbackURL:"http://localhost:5000/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // Stuff to do after verified.
    console.log("PROFILE: " + profile);
    console.log("ACCESS TOKEN: " + JSON.stringify(accessToken));
    console.log("REFRESH TOKEN: " + JSON.stringify(refreshToken));
    // done is what is returned to the user.
    return done("Successfully verified!");
  }
));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

// auth code from https://c9.io/barberboy/passport-google-oauth2-example
// send auth request to google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email profile'] }));

// get auth callback from google
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failLogin' }),
    function (request, response) {
    // The response that comes back is the content of the "return done('CONTENT'); in the strategy definition"
    // console.log("retrieved a callback! Contents:");
    // console.log(JSON.stringify(response));
    // response.redirect('/');
    // response.render('pages/success');
});

// Failed to login.
app.get('/failLogin', function (request, response) {
  response.render(pages/fail);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
