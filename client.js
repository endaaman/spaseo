(function() {
  var isOnPhantom = typeof window.callPhantom === 'function'
  var innerWrapper = function(callback) {
    setTimeout(function() {
      callback()
    }, 0);
  };

  var originalCallback = function() {
    if (isOnPhantom) {
        window.callPhantom('SPASEO_NOTIFY_RENDERING_FINISH');
    }
  };

  var spaseo = function(){
    if (isOnPhantom) {
      window.callPhantom('SPASEO_NOTIFY_RENDERING_START');
    }
    return function() {
      innerWrapper(originalCallback);
    }
  }

  spaseo.wrap = function(wrapper) {
    innerWrapper = wrapper;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = spaseo;
  } else {
    window.spaseo = spaseo;
  }
})();
