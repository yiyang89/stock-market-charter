var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var yahooFinance = require('yahoo-finance');
var socketserver = require('http').Server(app);
var io = require('socket.io')(socketserver);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var loadedStocks = {"AAPL":null, "GOOG": null};
var combined = [];

// On server start:
checkRecents(function(symbolArr) {
  // Get data that needs updating from yahoo-finance
  var tracker = 0;
  symbolArr.forEach(function (symbol) {
    getQuote(symbol, function(quotes) {
      console.log("Updated data for stock symbol: " + symbol);
      tracker++;
      loadedStocks[symbol.toUpperCase()] = quotes;
      if (tracker === symbolArr.length) {
        mongowrap.updateDates(generateStockLatest(), function(msg) {});
        mongowrap.updateData(loadedStocks, function(msg) {});
        mongowrap.getData(loadedStocks, function(data) {
          loadedStocks = data;
        })
      }
    })
  })
})

function getQuote(symbol, callback) {
  yahooFinance.historical({
    symbol: symbol,
    from: getOneYearDate(),
    to: getCurrentDate()
  }, function(err, quotes) {
    if (quotes === []) {
      console.log("Symbol "+symbol+" does not exist!");
      callback(0);
    } else {
      callback(quotes);
    }
  })
}

// Check mongo db for individuals.
function checkRecents(callback) {
  mongowrap.getDates(function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var callbackArr = [];
      // Return an array of stock symbols and dates.
      if (data.length === 0) {
        callback(Object.keys(loadedStocks));
      }
      data.forEach(function(datapoint) {
        if (datapoint.date !== getCurrentDate()) {
          callbackArr.push(datapoint.symbol);
        }
      })
      callback(callbackArr);
    }
  })
}

function generateStockLatest() {
  var stockSymbols = Object.keys(loadedStocks);
  var dateString = getCurrentDate();
  var updated = [];
  stockSymbols.forEach(function(symbol) {
    if (!loadedStocks.symbol) {
      updated.push({'symbol':symbol, 'date':dateString});
    }
  })
  console.log(JSON.stringify(updated));
  return updated;
}

function generateCombined() {

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


socketserver.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

io.on('connection', function(socket) {
  console.log('a user connected');
  // Send loaded stocks on connect.
  socket.emit('stocklist', loadedStocks);
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('add code', function(msg) {
    console.log('Received request to add code: ' + msg);
    loadedStocks.individual[msg.toUpperCase()] = null;
    getStocks(function(data) {
      if (data === 0) {
        delete loadedStocks.individual[msg.toUpperCase()];
        socket.emit('code does not exist', 'Stock code ' + msg + ' does not exist.');
      } else {
        io.emit('stocklist', loadedStocks);
      }
    });
  });
  socket.on('remove code', function(msg) {
    console.log('Received request to remove code: ' + msg);
    // TODO: CHECK IF A VALID STOCK
    delete loadedStocks[msg];
    io.emit('stocklist', loadedStocks);
  });
})
