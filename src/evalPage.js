var phantom = require('phantom');
var u = require('./util');

var ph;

module.exports = function (targetUrl, callback){
  var page = null;
  var waitingForCallback = false;
  var finished = false;
  var config = require('./config')();

  function evalAndRender(page, status) {
    page.evaluate((function() {
      return document.documentElement.outerHTML;
    }), function(html) {
      if (!finished) {
        if (!status) {
          status = 200;
        }
        callback(html, status);
        finished = true;
        u.$log('rendered ' + targetUrl);
      }
    });
  }

  function onCallback(data) {
    switch (data.command) {
      case 'START':
        if waitingForCallback
          return;
        waitingForCallback = true;
        u.$log('Waiting callback from client..');
        setTimeout(function() {
          u.$log('Timeout: cb was acquired but the cb has not been called.');
          evalAndRender(page, 200);
        }, config.timeoutDuration);
      break;
      case 'FINISH':
        u.$log('Got callback from client');
        evalAndRender(page, data.status);
      break;
      case 'LOG':
        u.$log(data.text+' (from client)');
      break;
    }
  }

  function onOpen(status) {
    setTimeout(function() {
      if (!waitingForCallback) {
        u.$log('Redering immediately..');
        evalAndRender(page, 200);
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
      u.$log('Created PhantomJS instance');
      ph.createPage(onPageCreate);
    });
  }

}
