var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
// SET THIS TO A DB ON MLAB FOR DEPLOYMENT.
var url = 'mongodb://dummyUser:abc123@ds143030.mlab.com:43030/herokustuff';

// Returns {"unix": [unixtime], "natural": [naturaltime]}
module.exports.getSize = function(callback) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established for size query to', url);
      db.collection('urls').find().toArray(function (err, result) {
        console.log(result);
        db.close();
        callback(result.length);
      });
    }
  });
};

module.exports.addEntry = function(id, address, callback) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      db.collection('urls').insert({"_id":id, "url":address}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
          db.close();
          callback(id);
        }
      });
    }
  });
};

module.exports.retrieveEntry = function(entryID, callback) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      db.collection('urls').find({'_id':entryID}).toArray( function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          db.close();
          callback(result[0].url);
        }
      });
    }
  });
};
