var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var socketserver = require('http').Server(app);
var io = require('socket.io')(socketserver);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var loadedStocks = [];

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

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

socketserver.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    console.log('user disconnected');
  })
  console.log('a user connected');
})
