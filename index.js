var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var socketserver = require('http').Server(app);
var io = require('socket.io')(socketserver);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var loadedStocks = {"AAPL":null, "GOOG":null, "FB":null};

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
  // Send loaded stocks on connect.
  socket.emit('stocklist', loadedStocks);
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('add code', function(msg) {
    console.log('Received request to add code: ' + msg);
    // TODO: CHECK IF A VALID STOCK
    loadedStocks[msg.toUpperCase()] = null;
    io.emit('stocklist', loadedStocks);
  });
  socket.on('remove code', function(msg) {
    console.log('Received request to remove code: ' + msg);
    // TODO: CHECK IF A VALID STOCK
    delete loadedStocks[msg];
    io.emit('stocklist', loadedStocks);
  })
  console.log('a user connected');
})
