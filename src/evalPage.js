(function(){
'use strict';

var commands = require('./commands');
var phantom = require('phantom');

var ph;

module.exports = function (targetUrl, config, callback){
  function $log(line) {
    if (config.verbose) console.log(line);
  }

  var page = null;
  var waitForCallback = false;
  var finished = false;

  function evalAndRender(page) {
    page.evaluate((function() {
      return document.documentElement.outerHTML;
    }), function(html) {
      if (!finished) {
        callback(html);
        finished = true;
        $log('rendered ' + targetUrl);
      }
    });
  }

  function onCallback(command) {
    switch (command) {
      case commands.start:
        $log('Waiting callback from client..');
        waitForCallback = true;
        setTimeout(function() {
          evalAndRender(page);
        }, config.timeoutDuration);
      break;
      case commands.finish:
        $log('Got callback from client');
        evalAndRender(page);
      break;
    }
  }

  function onOpen(status) {
    setTimeout(function() {
      if (!waitForCallback) {
        $log('Redering immediately..');
        evalAndRender(page);
      }
    }, config.cushionDuration);
  }

  function onPageCreate(__page) {
    page = __page;
    __page.set('settings.loadImages', false);
    __page.set('onCallback', onCallback);
    __page.open(targetUrl, onOpen);
  }

  if (ph) {
    ph.createPage(onPageCreate);
  } else {
    phantom.create(function(__ph) {
      ph = __ph;
      $log('Created PhantomJS instance');
      ph.createPage(onPageCreate);
    });
  }

}

})();
