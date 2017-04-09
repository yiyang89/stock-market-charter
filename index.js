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
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
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

app.get('/', function(request, response) {
  response.render('pages/index', {'user': null, 'poll':null});
});

// Request to backend for initial polls.
app.get('/api/getpolls', function(request, response) {
  // Query mongodb for all polls and return.
  mongowrap.getPolls(function(err, result) {
    // Flip before returning so latest shows first.
    result = result.reverse();
    response.send(result);
  });
});

// Request to backend for poll creation (pollanswers as an array)
app.get('/api/createpoll/', function(request, response) {
  // Insert new poll into mongodb
  // Return success or fail to user
  // Create a poll for me to play with.
  console.log("making call to mongowrap to create new poll");
  // console.log(request.query);
  mongowrap.createPoll(request.query.userid, request.query.question, request.query.answer, function (err, result) {
    // console.log(result);
    if (err) {
      response.send({"message":"An error was encountered"});
    } else {
      response.send({"message":"Successfully added the poll to db"});
    }
  });
});

// Request to backend to vote
app.get('/api/votepoll', function(request, response) {
  console.log(request.query);
  var ip = request.headers['x-forwarded-for'] ||
     request.connection.remoteAddress ||
     request.socket.remoteAddress ||
     request.connection.socket.remoteAddress;
  console.log(ip);
  mongowrap.votePoll(ip, request.query.id, request.query.answer, request.query.userid, function(err, data) {
    if (err) {
      console.log("Mongo vote error: " + err);
      response.send({"ERROR:":err});
    } else {
      response.send({"message":"Successfully voted on this poll"});
    }
  });
})

// Request to backend for poll deletion
app.get('/api/deletepoll', function(request, response) {
  //  Get userid and pollid from POLL_PARAMS
  mongowrap.deletePoll(request.query.id, request.query.userid, function(err, data) {
    if (err) {
      console.log("Mongo delete error: " + err);
      response.send({"ERROR":err});
    } else {
      if (data.value) {
        console.log("User " + request.query.userid + " has deleted poll #" + request.query.id);
        response.send({"message":"Successfully deleted question ID #" + request.query.id});
      } else {
        response.send({"ERROR":"Poll does not belong to you"});
      }
    }
  })
})

// Request to backend to load a specific poll page
app.get('/api/poll/:POLLID', function (request, response) {
  // Get polls from mongo
  mongowrap.getPolls(function(err, result) {
    // Find the poll matching request.params.POLLID
    var pollResult;
    console.log(JSON.stringify(result));
    console.log(request.params.POLLID);
    result.forEach(function(entry) {
      console.log(typeof entry._id.toString());
      if (entry._id.toString() === request.params.POLLID) {
        pollResult = entry;
      }
    });
    console.log(pollResult)
    if (pollResult) {
      // Found a matching pollid
      response.render('pages/index', {'user':null, 'poll':pollResult});
    } else {
      // Did not find a matching pollid
      response.send("Could not find a poll with that id!");
    }
  });
})

// auth code from https://c9.io/barberboy/passport-google-oauth2-example
// send auth request to google
app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }))

// get auth callback from google
app.get('/auth/google/callback',
passport.authenticate('google'),
function(request, response) {
  console.log("finished authentication");
  if (request.user) {
    response.render('pages/index', {'user':request.user.emails[0].value, 'poll':null});
  } else { response.jsonp(401); }
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
