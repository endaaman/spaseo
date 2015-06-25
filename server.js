(function() {
  var http = require('http');
  var phantom = require('phantom');
  var prettify = require('./prettify');
  var pjson = require('./package.json');
  var commands = require('./commands');

  var logPrefix = '[spaseo] ';
  var ph = null;

  module.exports = function(config) {
    config = config || {}
    var port = parseInt(config.port) || 9999;
    var timeout = parseInt(config.timeout) || 7000;
    var targetBaseUrl = config.baseUrl || null;
    var logging = !!config.logging;

    var $log = function(message, w) {
      if (logging){
          var l;
          if (w) {
              l = console.warn;
          } else {
              l = console.log;
          }
          if (Array.isArray(message)) {
              for (var i in message) {
                  if (i > 0) {
                      l(Array(logPrefix.length+1).join(' ') + message[i]);
                  } else {
                      l(logPrefix + message[i]);
                  }
              }
          } else {
              l(logPrefix + message);
          }
      }
    };

    var regRequestingForSelf = new RegExp(':'+port);

    var server = http.createServer(function(request, response) {
      $log('Incoming request');
      var baseUrl;
      if (targetBaseUrl) {
          baseUrl = targetBaseUrl;
      } else {
          baseUrl = 'http://' + request.headers.host
      }

      var requestingForSelf = regRequestingForSelf.test(request.headers.host);
      var uglyUrl = baseUrl + request.url;
      var originalUrl = prettify(uglyUrl);
      if (!originalUrl || requestingForSelf ) {
        var message = [];
        if (!originalUrl) {
            message.push('Not specified ugly url');
        }
        if (requestingForSelf) {
            message.push('Referring directly to spaseo server');
            message.push('Are you missing `proxy_set_header Host $host` on nginx.conf');
            message.push('or not specified targetBaseUrl?');
        }
        message.push('See `https://github.com/endaaman/spaseo.js/blob/master/README.md`. It may help you.');
        $log(message, true);
        res = {
            name: pjson.name,
            version: pjson.version,
            timeout: timeout,
            targetBaseUrl: targetBaseUrl,
            logging: !!logging,
            message: message
        }
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
        return;
      }

      var finished = false;
      var waitForCallback = false;

      function evalAndRender(page) {
        page.evaluate((function() {
          return document.documentElement.innerHTML;
        }), function(html) {
          if (!finished) {
            response.writeHead(200, {});
            response.write(html);
            response.end();
            finished = true;
            $log('rendered html');
            $log('ugly  :' + originalUrl);
            $log('pretty:' + uglyUrl);
          }
        });
      }

      // start rendering using phantom
      ph.createPage(function(page) {
        page.set('settings.loadImages', false);
        page.set('onCallback', function(command) {
          switch (command) {
            case commands.start:
              $log('Waiting callback from client..');
              waitForCallback = true;
              setTimeout(function() {
                evalAndRender(page);
              }, timeout);
            break;
            case commands.finish:
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
      });

    });
    $log('Starting spaseo.js..');
    $log('Creating PhantomJS instance..');

    phantom.create(function(__ph) {
      ph = __ph;
      $log('Created PhantomJS instance');
      server.listen(port);
      $log('Spaseo server started listening http://127.0.0.1:'+port);
    });
  };

})();
