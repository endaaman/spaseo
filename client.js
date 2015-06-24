(function() {
  var isOnPhantom = typeof window.callPhantom === 'function'
  var spaseo = function(){
    if (isOnPhantom) {
      window.callPhantom('SPASEO_NOTIFY_RENDERING_START');
    }
    return function(debounce) {
      if (isOnPhantom) {
        setTimeout(function() {
          window.callPhantom('SPASEO_NOTIFY_RENDERING_START');
        }, Math.abs(parseInt(debounce, 0)));
      }
    }
  }
  if (typeof module !== 'undefined' && module.exports) {
      module.exports = spaseo;
  } else {
    window.spaseo = spaseo;
  }
})();
