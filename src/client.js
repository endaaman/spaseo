(function(){
'use strict';

var commands = require('./commands');

var isOnPhantom = typeof window.callPhantom === 'function'
var innerWrapper = function(callback) {
  setTimeout(function() {
    callback()
  }, 0);
};

var originalCallback = function() {
  if (isOnPhantom) {
      window.callPhantom(commands.start);
  }
};

var spaseo = function(){
  if (isOnPhantom) {
    window.callPhantom(commands.finish);
  }
  return function() {
    innerWrapper(originalCallback);
  }
}

spaseo.wrap = function(wrapper) {
  innerWrapper = wrapper;
}

module.exports = spaseo;

})();
