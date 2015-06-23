(function() {
  var isOnPhantom = typeof window.callPhantom === 'function'
  var commands = {
    start : 'SPASEO_CB_START',
    finish: 'SPASEO_CB_FINISH'
  }
  var spaseo = function(debounce){
    if (isOnPhantom) {
      window.callPhantom(commands.start);
    }
    return function() {
      if (isOnPhantom) {
        setTimeout(function() {
          window.callPhantom(commands.finish);
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
