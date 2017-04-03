// Returns {"unix": [unixtime], "natural": [naturaltime]}
module.exports.parseLanguage = function(str) {
  // Example incoming string:
  //"en-US,en;q=0.8"
  return str.slice(0, 5);
};

module.exports.parseOS = function(str) {
  // Example incoming string:
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36
  // (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36"
  var temp0 = str.split('(');
  var temp1 = temp0[1].split(';');
  var temp2 = temp1[1].split(')')[0];
  return temp2;
};
