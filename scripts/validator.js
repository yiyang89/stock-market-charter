var fs = require('fs');
var path = require('path');

// Returns {"unix": [unixtime], "natural": [naturaltime]}
module.exports.process = function(str, callback) {
  var returnObject = {"unix":null, "natural": null};

  // Use date to process. Check for values of NaN
  // Validate natural language date format
  if (!isNaN((new Date(str)).getMonth())) {
    console.log("in natural");
    var dateNatural = new Date(str);
    returnObject.natural = dateNatural.toUTCString().split(' ').slice(0, 4).join(' ');
    // returnObject.unix = Math.floor((new Date(str))/1000);
    returnObject.unix = dateNatural/1000 - dateNatural.getTimezoneOffset() * 60;
  } else if (!isNaN((new Date(parseInt(str)*1000)).getMonth())) {
    // Validate unix time format
    console.log("in unix");
    var dateUnix = new Date(parseInt(str)*1000);
    // returnObject.natural = dateUnix.getUTCMonth() + " " + dateUnix.getUTCDate() + ", " + dateUnix.getUTCFullYear();
    returnObject.natural = dateUnix.toUTCString().split(' ').slice(0, 4).join(' ');
    returnObject.unix = dateUnix/1000;
  }
  return returnObject;
};
