(function() {
  var http = require('http');
  var phantom = require('phantom');

  prettify = require('./prettify');

  var __ph = null;

  module.exports = function(targetBaseUrl, timeout, logging) {
    var server;
    if (targetBaseUrl == null) {
      throw new Error(logPrefix + "paramater is required");
    }
    var timeout = (parseInt(timeout)) || 3000;

    var logPrefix = '[spaseo]: ';
    $log = function(message) {
      if( logging ){
          console.log(logPrefix + message);
      }
    };

    var server = http.createServer(function(request, response) {
      $log('Incoming request.');
      var uglyUrl = targetBaseUrl + request.url;
      var originalUrl = prettify(uglyUrl);

      var finished = false;
      var waitForCallback = false;

      var evalAndRender = function(page) {
        page.evaluate((function() {
          return document.documentElement.innerHTML;
        }), function(html) {
          if (!finished) {
            response.writeHead(200, {});
            response.write(html);
            response.end();
            finished = true;
            $log("Rendered: " + originalUrl + "(" + uglyUrl + ")");
          }
        });
      };

      var onPageCreated = function(page) {
        page.set('settings.loadImages', false);
        page.set('onCallback', function(command) {
          switch (command) {
            case 'SPASEO_CB_START':
              $log('Waiting callback from client..');
              waitForCallback = true;
              setTimeout(function() {
                evalAndRender(page);
              }, timeout);
            break;
            case 'SPASEO_CB_FINISH':
              $log('Got callback from client');
              evalAndRender(page);
            break;
          }
        });

        page.open(originalUrl, function(status) {
          if (!waitForCallback) {
            $log('Redering immediately..');
            evalAndRender(page);
          }
        });

      };

      var createPage = function(ph) {
        ph.createPage(onPageCreated);
      };

      if (__ph === null) {
        return phantom.create(function(ph) {
          __ph = ph;
          $log('Created PhantomJS instance')
          createPage(__ph);
        });
      } else {
        createPage(__ph);
      }
    });

    return server;
  };
})();
