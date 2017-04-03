var express = require('express');
var app = express();
var multer = require('multer');
var upload = multer({dest:'./uploads/'});
var fs = require('fs');

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
