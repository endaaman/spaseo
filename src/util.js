var config = require('./config');

module.exports = {
  $log: function (line) {
    if (config().verbose) console.log(line);
  }
};
