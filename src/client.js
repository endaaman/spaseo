(function(){
'use strict';

var isOnPhantom = typeof window.callPhantom === 'function';

var defaultWrapper = function(cb) {
  setTimeout(function() {
    cb()
  }, 0);
};

var innerWrapper = defaultWrapper;

var $log = function(text) {
  if (isOnPhantom) {
    window.callPhantom({
      command: 'LOG',
      text: text
    });
  }
}

var originalCallback = function(status) {
  if (isOnPhantom) {
    if (!status) {
      status = 200;
    }
    window.callPhantom({
      command: 'FINISH',
      status: status
    });
  }
};

var spaseo = function(){
  if (isOnPhantom) {
    window.callPhantom({
      command: 'START'
    });
  }
  return function(status) {
    innerWrapper(function (){
      originalCallback(status);
    });
  }
}

spaseo.isOnPhantom = isOnPhantom;

spaseo.wrap = function(wrapper) {
  innerWrapper = wrapper;
}

spaseo.log = function(text) {
  $log(text);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = spaseo;
} else {
  window.spaseo = spaseo;
}

})();
