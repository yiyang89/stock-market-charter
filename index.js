var express = require('express');
var app = express();
var extractor = require('./scripts/extractor.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/api/whoami/', function(request, response) {
  var respObject = {"ipaddress": null, "language":null, "software": null};
  console.log(request.headers);
  respObject.ipaddress = request.headers['x-forwarded-for'];
  respObject.language = extractor.parseLanguage(request.headers['x-language']||request.headers['accept-language']);
  respObject.software = extractor.parseOS(request.headers['user-agent']);
  response.send(respObject);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
