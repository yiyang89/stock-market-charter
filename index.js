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
checkAndGather(function(data) {});

function checkAndGather(callback) {
  checkRecents(function(symbolsToUpdateArr) {
    // Get data that needs updating from yahoo-finance
    if (symbolsToUpdateArr.length === 0) {
      updateAndGet(false, function(data) {
        console.log("Data update not required");
        callback(null,data);
      });
    } else {
      var tracker = 0;
      symbolsToUpdateArr.forEach(function (symbol) {
        getQuote(symbol, function(quotes) {
          if (quotes.length === 0) {
            delete loadedStocks[symbol];
            callback(symbol+" does not exist", null);
          } else {
            console.log("Updated data for stock symbol: " + symbol);
            tracker++;
            loadedStocks[symbol.toUpperCase()] = quotes;
            if (tracker === symbolsToUpdateArr.length) {
              updateAndGet(true, function(data) {
                callback(null,data);
              });
            }
          }
        })
      })
    }
  })
}


function updateAndGet(updateRequired, callback) {
  if (updateRequired) {
    mongowrap.updateDates(generateStockLatest(), function(err, msg) {});
    mongowrap.updateData(loadedStocks, function(err, msg) {
      mongowrap.getData(loadedStocks, function(err, data) {
        loadedStocks = data;
        generateCombined();
        callback(null);
      })
    });
  } else {
    mongowrap.getData(loadedStocks, function(err, data) {
      loadedStocks = data;
      generateCombined();
      callback(null);
    })
  }
}

function getQuote(symbol, callback) {
  yahooFinance.historical({
    symbol: symbol,
    from: getOneYearDate(),
    to: getCurrentDate()
  }, function(err, quotes) {
    console.log("Made a call to yahoofinance for symbol " + symbol);
    if (quotes === []) {
      console.log("Symbol "+symbol+" does not exist!");
      callback(0);
    } else {
      // format quotes
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
      var loadedKeys = Object.keys(loadedStocks);
      // Return an array of stock symbols and dates.
      if (data.length === 0) {
        callback(loadedKeys);
      }
      data.forEach(function(datapoint) {
        if (datapoint.date !== getCurrentDate()) {
          callbackArr.push(datapoint.symbol);
        }
        for (var i = 0; i < loadedKeys.length; i++) {
          if (loadedKeys[i] === datapoint.symbol) {
            loadedKeys.splice(i, 1);
          }
        }
      })
      callback(callbackArr.concat(loadedKeys));
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
  // console.log(JSON.stringify(updated));
  return updated;
}

function generateCombined() {
  combined = [];
  var stockKeys = Object.keys(loadedStocks);
  var firstEntry = true;
  stockKeys.forEach(function(key) {
    for (var i = 0; i < loadedStocks[key].length; i++) {
      if (firstEntry) {
        combined.push([formatDate(new Date(loadedStocks[key][i].date)), loadedStocks[key][i].close]);
      } else {
        combined[i].push(loadedStocks[key][i].close);
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

function generateReturnObject() {
  var keys = Object.keys(loadedStocks);
  var returnObject = {'individual':{}, 'combined': combined};
  keys.forEach (function(key) {
    returnObject.individual[key] = null;
  })
  return returnObject;
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
  socket.emit('stocklist', generateReturnObject());
  socket.on('request stocklist', function() {
    socket.emit('stocklist', generateReturnObject());
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  socket.on('add code', function(msg) {
    console.log('Received request to add code: ' + msg);
    if (msg.length > 5) {
      socket.emit('code does not exist', msg.toUpperCase() + " does not exist");
    } else {
      loadedStocks[msg.toUpperCase()] = null;
      checkAndGather(function(err, data) {
        if (err) {
          socket.emit('code does not exist', err);
        } else {
          io.emit('stocklist', generateReturnObject());
        }
      });
    }
  });
  socket.on('remove code', function(msg) {
    console.log('Received request to remove code: ' + msg);
    delete loadedStocks[msg];
    generateCombined();
    io.emit('stocklist', generateReturnObject());
  });
})
