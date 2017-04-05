var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer({dest:'./uploads/'});
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
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
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

// courtesy of https://howtonode.org/really-simple-file-uploads
app.post('/file-size', upload.single('file'), function(request, response, next) {
  console.log(request.file);
  var size = request.file.size;
  // delete the temp file
  fs.unlinkSync('./uploads/' + request.file.filename);
  response.send({'size':size});
});

// auth code from https://c9.io/barberboy/passport-google-oauth2-example
// send auth request to google
app.get('/auth/google', function(request, response) {
  // Do some google auth stuff here
  passport.authenticate('google', { scope: ['email profile'] });
});

// get auth callback from google
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'pages/fail' }), function (request, response) {
  console.log("retrieved a callback! Contents:");
  console.log(JSON.stringify(response));
  response.render('pages/success');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
