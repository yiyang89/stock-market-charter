var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var socketserver = require('http').Server(app);
var io = require('socket.io')(socketserver);
var yahooFinance = require('yahoo-finance');
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// var loadedStocks = {"AAPL":null, "GOOG":null, "FB":null};
var loadedStocks = {"individual":{"AAPL":null, "GOOG": null}, "combined":[]};
// Load stock data for loadedStocks:
getStocks(function(msg) {});

function getStocks(callback) {
  var individualKeys = Object.keys(loadedStocks.individual);
  var tracker = 0;
  individualKeys.forEach(function(key) {
    yahooFinance.historical({
      symbol: key,
      from: getOneYearDate(),
      to: getCurrentDate()
    }, function(err, quotes) {
      tracker++;
      if (err) {
        console.log(JSON.stringify(err));
      } else {
        // Format the data for front end.
        var quoteArray = [];
        quotes.forEach(function(quote) {
          quoteArray.push([formatDate(quote.date), quote.close, quote.symbol]);
        });
        loadedStocks.individual[key] = quoteArray;
      }
      if (tracker === individualKeys.length) {combineStocks(); callback('finished');}

    })
  });
}

function combineStocks() {
// read the keys in loadedStocks[0] and combine them.
  loadedStocks.combined = [];
  var stockKeys = Object.keys(loadedStocks.individual);
  var firstEntry = true;
  stockKeys.forEach(function(key) {
    for (var i = 0; i < loadedStocks.individual[key].length; i++) {
      if (firstEntry) {
        loadedStocks.combined.push([loadedStocks.individual[key][i][0], loadedStocks.individual[key][i][1]]);
      } else {
        loadedStocks.combined[i].push(loadedStocks.individual[key][i][1]);
      }
    }
    firstEntry = false;
    console.log("Loaded "+key+" into combined");
  })
}

function formatDate(dateObject) {
  return dateObject.getFullYear() + "-" + ('0' + (dateObject.getMonth()+1)).slice(-2) + "-" + ('0' + dateObject.getDate()).slice(-2);
}

function getCurrentDate() {
  return formatDate(new Date());
}
function getOneYearDate() {
  return formatDate(new Date(new Date - 31557600000));
}

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
    loadedStocks.individual[msg.toUpperCase()] = null;
    getStocks(function(msg) {
      io.emit('stocklist', loadedStocks);
    });
  });
  socket.on('remove code', function(msg) {
    console.log('Received request to remove code: ' + msg);
    // TODO: CHECK IF A VALID STOCK
    delete loadedStocks[msg];
    io.emit('stocklist', loadedStocks);
  })
  console.log('a user connected');
})
