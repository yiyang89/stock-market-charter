var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
// SET THIS TO A DB ON MLAB FOR DEPLOYMENT.
var url = process.env.MONGO_ADDRESS;

// collection: stocks;
// No deletes, this collection will act as a cache
// methods:
// getDates(callback)
// getAll(stocksObject, callback) - Takes the currently loaded stocks and looks them all up in mongo (for on connect);
// getOne(code, callback) - Get the data for 1 stock code (for on add - cache functionality);
// updateOne(data, callback) - Update stock data for all loaded stocks(aka for up to yesterday's closing);

module.exports.getDates = function(callback) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      callback(err, null);
    } else {
      db.collection('stockDates').find().toArray( function (err, result) {
        if (err) {
          callback(err, null);
        } else {
          // Callback results
          callback(null, result);
        }
      })
    }
  })
}

module.exports.updateDates = function(symbolsAndDates, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      callback(err, null);
    } else {
      console.log(symbolsAndDates);
      symbolsAndDates.forEach(function(symbolAndDate) {
        db.collection('stockDates').replaceOne(
          {"symbol":symbolAndDate.symbol},
          symbolAndDate,
          {"upsert": true}
        );
      })
      callback(null, 1);
    }
  })
}


// "GOOG":[{"_id":"58f41acb6f9ca35573bd36c1","symbol":"GOOG","quotes":[{"date":"2016-04-18T04:00:00.000Z","open":760.460022,"high":768.049988,"low":757.299988,"close":766.609985,"volume":1556000,"adjClose":766.609985,"symbol":"GOOG"},{"date":"2016-04-19T04:00:00.000Z","open":769.51001,"high":769.900024,"low":749.330017,"close":753.929993,"volume":2030500,"adjClose":753.929993,"symbol":"GOOG"},{"date":"2016-04-20T04:00:00.000Z","open":758,"high":758.132019,"low":750.01001,"close":752.669983,"volume":1529200,"adjClose":752.669983,"symbol":"GOOG"},{"date":"2016-04-21T04:00:00.000Z","open":755.380005,"high":760.450012,"low":749.549988,"close":759.140015,"volume":3060500,"adjClose":759.140015,"symbol":"GOOG"},{"date":"2016-04-22T04:00:00.000Z","open":726.299988,"high":736.119995,"low":713.609985,"close":718.77002,"volume":5951900,"adjClose":718.77002,"symbol":"GOOG"},{"date":"2016-04-25T04:00:00.000Z","open":716.099976,"high":723.929993,"low":715.590027,"close":723.150024,"volume":1959200,"adj
// Close":723.150024,"symbol":"GOOG"},{"date":"2016-04-26T04:00:00.000Z","open":725.419983,"high":725.765991,"low":703.026001,"close":708.140015,"volume":2744600,"adjClose":708.140015,"symbol":"GOOG"},{"date":"2016-04-27T04:00:00.000Z","open":707.289978,"high":708.97998,"low":692.36499,"close":705.840027,"volume":309860
module.exports.getData = function(stocksObject, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      callback(err, null);
    } else {
      var symbols = Object.keys(stocksObject);
      var callbackObject = {};
      tracker = 0;
      symbols.forEach(function(symbol) {
        db.collection('stockData').find({"symbol":symbol}).toArray( function (err, result) {
          tracker++;
          callbackObject[symbol] = result[0].quotes;
          if (tracker === symbols.length) {
            callback(null, callbackObject);
          }
        });
      })
    }
  })
}

// If null, just retrieve, else update and retrieve.
module.exports.updateData = function(stocksObject, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      callback(err, null);
    } else {
      var symbols = Object.keys(stocksObject);
      symbols.forEach(function(symbol) {
        if (stocksObject[symbol]) {
          db.collection('stockData').replaceOne(
            {"symbol": symbol},
            {"symbol": symbol, "quotes": stocksObject[symbol]},
            {"upsert": true}
          );
        }
      })
      callback(null, 1);
    }
  })
}

// module.exports.getPolls = function(callback) {
//   MongoClient.connect(url, function (err, db) {
//     if (err) {
//       console.log('Unable to connect to the mongoDB server. Error:', err);
//     } else {
//       db.collection('polls').find().toArray( function (err, result) {
//         if (err) {
//           console.log(err);
//         } else {
//           // If no results found, redirect to a page notifying user
//           console.log("mongodb getPolls success: ");
//           db.close();
//           callback(err, result);
//         }
//       });
//     }
//   });
// }
//
// module.exports.createPoll = function(user_id, poll_question, poll_answers, callback) {
//   var newEntry = {"creator_id": user_id, "question": poll_question, "answers": poll_answers, "voted":[]};
//   MongoClient.connect(url, function (err, db) {
//     if (err) {
//       console.log('Unable to connect to the mongoDB server. Error:', err);
//     } else {
//       db.collection('polls').insertOne(newEntry, function (err, result) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
//           db.close();
//           callback(err, result);
//         }
//       });
//     }
//   });
// }
//
// module.exports.deletePoll = function(poll_id, user_id, callback) {
//   var filterclause = {'_id': mongodb.ObjectId(poll_id), 'creator_id': user_id};
//   MongoClient.connect(url, function (err, db) {
//     if (err) {
//       console.log('Unable to connect to the mongoDB server. Error:', err);
//     } else {
//       db.collection('polls').findOneAndDelete(filterclause, function (err, result) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("mongodb removeQuery success: " + JSON.stringify(result));
//           db.close();
//           callback(err, result);
//         }
//       });
//     }
//   });
// }
//
// // Do a find for the question
// // See if votes for this question contains a vote by this user_ip already
// module.exports.votePoll = function(user_ip, poll_id, answer, user_id, callback) {
//   var filterclause = {'_id': mongodb.ObjectId(poll_id)};
//   MongoClient.connect(url, function (err, db) {
//     if (err) {
//       console.log('Unable to connect to the mongoDB server. Error:', err);
//     } else {
//       // Find existing voted array
//       db.collection('polls').find(filterclause).toArray( function (err, result) {
//         if (err) {
//           console.log(err);
//           callback(err, null);
//         } else if (result.length === 0) {
//           callback("Unable to find this poll", null);
//         } else {
//           // Update the 'voted' array if user ip has not voted on this before.
//           var singleResult = result[0];
//           var hasVoted = false;
//           singleResult.voted.forEach( function(entry) {
//             if (entry.user_ip === user_ip) {
//               hasVoted = true;
//             }
//           });
//           if (hasVoted) {
//             callback("User already has a vote on this poll", null);
//           } else {
//             // Update answer array if we are dealing with a new answer
//             if (!singleResult.answers.includes(answer)) {
//               singleResult.answers.push(answer);
//             }
//             singleResult.voted.push({'user_ip': user_ip, 'user_id': user_id, 'answer': answer});
//             db.collection('polls').update(filterclause, singleResult, function(err, result) {
//               console.log("Updated poll id: " + poll_id)
//               db.close();
//               callback(err, result);
//             });
//           }
//         }
//       });
//     }
//   });
// }
