var express = require('express');
var app = express();
var validator = require('./scripts/validator.js');

// User Story: I can pass a string as a parameter, and it will check to see whether that string contains
//            either a unix timestamp or a natural language date (example: January 1, 2016).
// User Story: If it does, it returns both the Unix timestamp and the natural language form of that date.
// User Story: If it does not contain a date or Unix timestamp, it returns null for those properties.

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/:CONTENT', function(request, response) {
  console.log(request.params);
  // parse the params.
  // examples:
  // [address]/December%2015,%202015
  // [address]/1450137600
  response.send(validator.process(request.params.CONTENT));

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
