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
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGO_ADDRESS;
var mongo;
MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log(err)
  } else {
    console.log("Successfully connected to mongodb");
    mongo = db;
    // On server start.
    checkAndGather(function(data) {
      socketserver.listen(app.get('port'), function() {
        console.log('Node app is running on port', app.get('port'));
      })
    });
  }
});

var loadedStocks = {"AAPL":null, "GOOG": null};
var combined = [];

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
          if (quotes === 0) {
            console.log(symbol + "DOES NOT EXIST");
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
    mongowrap.updateDates(mongo, generateStockLatest(), function(err, msg) {});
    mongowrap.updateData(mongo, loadedStocks, function(err, msg) {
      mongowrap.getData(mongo, loadedStocks, function(err, data) {
        loadedStocks = data;
        generateCombined();
        callback(null);
      })
    });
  } else {
    mongowrap.getData(mongo, loadedStocks, function(err, data) {
      loadedStocks = data;
      generateCombined();
      callback(null);
    })
  }
}

function getQuote(symbol, callback) {
  if (!loadedStocks[symbol]) {
    yahooFinance.historical({
      symbol: symbol,
      from: getOneYearDate(),
      to: getCurrentDate()
    }, function(err, quotes) {
      console.log("Made a call to yahoofinance for symbol " + symbol);
      // console.log(quotes);
      if (quotes.length === 0) {
        console.log("Symbol "+symbol+" does not exist!");
        callback(0);
      } else {
        formatQuote(quotes, function(data) {
          callback(data);
        })
      }
    })
  } else {
    callback(loadedStocks[symbol]);
  }
}

function formatQuote(quotes, callback) {
  // format quotes
  // Instead of an array, return an object with properties of dates.
  var returnObj = {};
  for (var i = 0; i < quotes.length; i++) {
    returnObj[formatDate(new Date(quotes[i].date))] = quotes[i];
  }
  callback(returnObj);
}

// Check mongo db for individuals.
function checkRecents(callback) {
  mongowrap.getDates(mongo, function(err, data) {
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
  return updated;
}

function generateCombined() {
  combined = [];
  // Create object of form: {date: [value, value, value], date: [value, value, value]...};
  // Goes in order of keys.
  var keys = Object.keys(loadedStocks);
  var temp = {};
  // Generate object with null values, keys are dates for the past year.
  // Courtesy of http://stackoverflow.com/questions/7114152/given-a-start-and-end-date-create-an-array-of-the-dates-between-the-two
  var date1 = new Date();
  var date2 = new Date(new Date - 31557600000);
  var day;
  while(date2 <= date1) {
    day = date1.getDate()
    date1 = new Date(date1.setDate(--day));
    temp[formatDate(date1)] = [];
  }
  var dateKeys = Object.keys(temp);
  dateKeys.forEach(function(dateKey) {
    // Populate for each key
    keys.forEach(function(key) {
      if (loadedStocks[key][dateKey]) {
        temp[dateKey].push(loadedStocks[key][dateKey].close);
      } else {
        temp[dateKey].push(null);
      }
    })
  })
  // Transform into array of arrays.
  dateKeys.forEach(function(dateKey) {
    combined.push([dateKey].concat(temp[dateKey]));
  })
  combined = combined.reverse();
  return null;
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
      socket.emit('symbol rejected', msg.toUpperCase() + " does not exist");
    } else if (Object.keys(loadedStocks).includes(msg.toUpperCase())) {
      socket.emit('symbol rejected', msg.toUpperCase() + " is already in the list");
    } else {
      // Check mongodb for data
      // Data does not exist in our db, get data from yahoo instead.
      mongowrap.checkExisting(mongo, msg.toUpperCase(), function(err, data) {
        if (err) {
          console.log(err);
        } else {
          if (data.length === 0) {
            // Get Data from Yahoo
            getQuote(msg.toUpperCase(), function(quotes) {
              if (quotes.length === 0) {
                socket.emit('symbol rejected', msg.toUpperCase() + " does not exist");
              } else {
                // Comes formatted from getQuote.
                loadedStocks[msg.toUpperCase()] = quotes;
                checkAndGather(function(err, data) {
                  if (err) {
                    socket.emit('symbol rejected', err);
                  } else {
                    io.emit('stocklist', generateReturnObject());
                  }
                });
              }
            });
          } else {
            // Plug in the data from mongo
            loadedStocks[msg.toUpperCase()] = null;
            checkAndGather(function(err, data) {
              if (err) {
                socket.emit('symbol rejected', err);
              } else {
                io.emit('stocklist', generateReturnObject());
              }
            });
          }
        }
      })
    }
  });
  socket.on('remove code', function(msg) {
    console.log('Received request to remove code: ' + msg);
    delete loadedStocks[msg];
    generateCombined();
    io.emit('stocklist', generateReturnObject());
  });
})
