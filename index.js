var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var mongowrap = require('./scripts/mongowrap.js');
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
// Each type of passport plugin will require its specific oauth strategy.
var GoogleStrategy = require('passport-google-oauth20').Strategy;
// Need to create credentials on https://console.developers.google.com/
// MOVE THESE INTO ENV VARIABLES BEFORE DEPLOYING.
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var AUTHHOST = process.env.AUTH_HOST;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

passport.use(new GoogleStrategy({
  clientID:     GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  // callbackURL: "http://oauth-template-decky.herokuapp.com/auth/google/callback",
  callbackURL: AUTHHOST + '/auth/google/callback',
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  // Stuff to do after verified.
  console.log("PROFILE: " + profile);
  console.log("ACCESS TOKEN: " + JSON.stringify(accessToken));
  console.log("REFRESH TOKEN: " + JSON.stringify(refreshToken));
  console.log(done);
  return done(null, profile);
}
));

// Serializing is part of session handling
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// views is directory for all template files
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname+'/views/pages/index2.html'));
});

// Request to backend for initial polls.
app.get('/api/getpolls', function(request, response) {
  // Query mongodb for all polls and return.
  mongowrap.getPolls(function(result) {
    response.send(result);
  });
});

// Request to backend for my polls
app.get('/api/getpolls/:USER_ID', function(request, response) {
  // Query mongodb for polls by this USER_ID and return
});

// Request to backend for poll creation (pollanswers as an array)
app.get('/api/createpoll/', function(request, response) {
  // Insert new poll into mongodb
  // Return success or fail to user
  // Create a poll for me to play with.
  console.log("making call to mongowrap to create new poll");
  mongowrap.createPoll("bob2", "what is a new", ['a person', 'a haircut', 'a cat'], function (result) {
    console.log(result);
    response.send("i don't know what a bob is lol");
  });
});

// Request to backend for poll modification
app.get('/api/addpolloption/:POLL_PARAMS', function(request, response) {
  // Get poll id and new answer option from POLL_PARAMS
  // Modify the entry in mongodb
  // Return success or fail to user
});

// Request to backend for poll deletion
app.get('/api/deletepoll/:POLL_PARAMS', function(request, response) {
  //  Get userid and pollid from POLL_PARAMS
  //  Query mongodb for userid match
  //  If match -> mongodb delete and return success
  //  Else return failure
})

// Request to backend to vote
app.get('/api/votepoll/:POLL_PARAMS', function(request, response) {
  // (How to disable multiple votes?)
  // -> Monkey patch: read the user's ip to disable multiple votes
  // Must check if poll even exists anymore (user may be voting on a deleted poll)
  // Return success or fail to user.
})

// auth code from https://c9.io/barberboy/passport-google-oauth2-example
// send auth request to google
app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }
))

// get auth callback from google
app.get('/auth/google/callback',
passport.authenticate('google'),
function(request, response) {
  console.log("finished authentication");
  if (request.user) {
    response.set({'Content-Type':'application/json'});
    response.send('someMethod' + '('+ JSON.stringify(request.user) + ');');
  } else { response.jsonp(401); }
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
